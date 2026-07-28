import type { Producer, RiskLevel, ScoreResult } from '../types';
import { opportunities } from '../data/seedData';
import { calculateOpportunityMatch } from './opportunityEngine';
import { calculateScenario, type ScenarioType } from './scenarioEngine';
import { calculateAgriScore } from './scoreEngine';

export type CouncilAgentId =
  | 'evidence'
  | 'risk'
  | 'resilience'
  | 'opportunity'
  | 'recourse';

export type CouncilAgentStatus = 'completed' | 'requires_review';
export type CouncilConfidence = 'yüksek' | 'orta' | 'düşük';

export interface CouncilAgentResult {
  id: CouncilAgentId;
  title: string;
  status: CouncilAgentStatus;
  confidence: CouncilConfidence;
  summary: string;
  evidence: string[];
  limitations: string[];
  methodology: string;
}

export interface CounterfactualAction {
  kind: 'evidence' | 'cost' | 'debt';
  label: string;
  assumption: string;
}

export interface CounterfactualPlan {
  achievable: boolean;
  targetScore: number;
  beforeScore: number | null;
  afterScore: number | null;
  beforeRisk: RiskLevel | null;
  afterRisk: RiskLevel | null;
  beforeReliability: number;
  afterReliability: number;
  actions: CounterfactualAction[];
  disclaimer: string;
}

export interface CouncilTraceStep {
  stage: number;
  agents: CouncilAgentId[];
  dependsOn: CouncilAgentId[];
  description: string;
}

export interface DecisionCouncilResult {
  orchestrationVersion: 'council-v1.0';
  methodologyVersion: 'rules-v2.0';
  producerId: string;
  score: ScoreResult;
  agents: CouncilAgentResult[];
  counterfactualPlan: CounterfactualPlan;
  humanReviewRequired: boolean;
  reviewPriority:
    | 'Veri Tamamlama Öncelikli'
    | 'Yoğun Uzman İncelemesi'
    | 'Koşullu İnceleme'
    | 'Standart Uzman İncelemesi';
  consensusStatement: string;
  disagreements: string[];
  trace: CouncilTraceStep[];
}

interface CandidatePlan {
  producer: Producer;
  actions: CounterfactualAction[];
  cost: number;
  result: ScoreResult;
}

const RESILIENCE_SCENARIOS: ScenarioType[] = [
  'Yem Maliyeti %15 Artarsa',
  'Süt Fiyatı %10 Düşerse',
  'Üretim %10 Düşerse',
];

const formatCurrency = (value: number | null) =>
  value === null
    ? 'Bilinmiyor'
    : new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
      }).format(value);

const cloneProducer = (producer: Producer): Producer => ({
  ...producer,
  herd: { ...producer.herd },
  financials: { ...producer.financials },
  productionHistory: producer.productionHistory.map((record) => ({ ...record })),
  riskNotes: [...producer.riskNotes],
  dataSources: producer.dataSources.map((source) => ({ ...source })),
  verificationNotes: [...producer.verificationNotes],
});

const getSubsets = (indexes: number[]): number[][] =>
  indexes.reduce<number[][]>(
    (subsets, index) => [
      ...subsets,
      ...subsets.map((subset) => [...subset, index]),
    ],
    [[]]
  );

function buildCounterfactualPlan(
  producer: Producer,
  baseline: ScoreResult
): CounterfactualPlan {
  if (baseline.overallScore === null || baseline.riskLevel === null) {
    return {
      achievable: false,
      targetScore: 50,
      beforeScore: null,
      afterScore: null,
      beforeRisk: null,
      afterRisk: null,
      beforeReliability: baseline.reliabilityResult.score,
      afterReliability: baseline.reliabilityResult.score,
      actions: [],
      disclaimer:
        'Eksik finansal bilgiler tamamlanmadan güvenli bir iyileştirme yolu hesaplanamaz.',
    };
  }

  const baselineScore = baseline.overallScore;
  const baselineRisk = baseline.riskLevel;
  const targetScore =
    baselineScore < 50
      ? 50
      : baselineScore < 75
        ? 75
        : baselineScore;

  if (
    baselineScore >= targetScore
    && baseline.reliabilityResult.score >= 80
  ) {
    return {
      achievable: true,
      targetScore,
      beforeScore: baselineScore,
      afterScore: baselineScore,
      beforeRisk: baselineRisk,
      afterRisk: baselineRisk,
      beforeReliability: baseline.reliabilityResult.score,
      afterReliability: baseline.reliabilityResult.score,
      actions: [],
      disclaimer:
        'Mevcut örnek profil hedef aralıkta ve veri güvenilirliği yeterli seviyededir.',
    };
  }

  const nonVerifiedIndexes = producer.dataSources
    .map((source, index) => (source.status === 'doğrulandı' ? -1 : index))
    .filter((index) => index >= 0);
  const verificationSubsets = getSubsets(nonVerifiedIndexes);
  const feedReductions = [0, 0.05, 0.1, 0.15];
  const otherCostReductions = [0, 0.1];
  const debtReductions = [0, 0.1, 0.2];
  const candidates: CandidatePlan[] = [];

  for (const verifiedIndexes of verificationSubsets) {
    for (const feedReduction of feedReductions) {
      for (const otherCostReduction of otherCostReductions) {
        for (const debtReduction of debtReductions) {
          const candidate = cloneProducer(producer);
          const actions: CounterfactualAction[] = [];

          for (const sourceIndex of verifiedIndexes) {
            const source = candidate.dataSources[sourceIndex];
            source.status = 'doğrulandı';
            actions.push({
              kind: 'evidence',
              label: `${source.name} kaynağını doğrula`,
              assumption:
                'Belgenin yalnızca yetkili kaynaktan gerçekten doğrulanması halinde geçerlidir.',
            });
          }

          if (feedReduction > 0) {
            candidate.financials.monthlyFeedCost *= 1 - feedReduction;
            actions.push({
              kind: 'cost',
              label: `Yem giderini %${Math.round(feedReduction * 100)} azaltan verimlilik senaryosu`,
              assumption:
                'Tedarik sözleşmesi veya rasyon optimizasyonuyla gerçekleştiği ayrıca kanıtlanmalıdır.',
            });
          }

          if (
            otherCostReduction > 0
            && candidate.financials.monthlyOtherCosts !== null
            && candidate.financials.monthlyOtherCosts > 0
          ) {
            candidate.financials.monthlyOtherCosts *= 1 - otherCostReduction;
            actions.push({
              kind: 'cost',
              label: `Diğer işletme giderlerini %${Math.round(otherCostReduction * 100)} azaltan senaryo`,
              assumption:
                'Operasyonel gider kesintisinin üretim veya hayvan refahını düşürmediği doğrulanmalıdır.',
            });
          }

          if (
            debtReduction > 0
            && candidate.financials.currentLoanInstallments !== null
            && candidate.financials.currentLoanInstallments > 0
          ) {
            candidate.financials.currentLoanInstallments *= 1 - debtReduction;
            actions.push({
              kind: 'debt',
              label: `Mevcut aylık borç servisini %${Math.round(debtReduction * 100)} azaltan yeniden yapılandırma senaryosu`,
              assumption:
                'Finans kurumu onayı olmadan gerçekleşmiş kabul edilemez.',
            });
          }

          const result = calculateAgriScore(candidate);
          const cost =
            verifiedIndexes.length
            + feedReduction * 20
            + otherCostReduction * 10
            + debtReduction * 10;

          if (
            result.overallScore !== null
            && result.riskLevel !== null
            && result.overallScore >= targetScore
            && result.reliabilityResult.score >= 50
          ) {
            candidates.push({ producer: candidate, actions, cost, result });
          }
        }
      }
    }
  }

  candidates.sort(
    (left, right) =>
      left.cost - right.cost
      || left.actions.length - right.actions.length
      || right.result.reliabilityResult.score
        - left.result.reliabilityResult.score
      || (right.result.overallScore ?? 0) - (left.result.overallScore ?? 0)
  );

  const best = candidates[0];
  if (!best) {
    return {
      achievable: false,
      targetScore,
      beforeScore: baselineScore,
      afterScore: baselineScore,
      beforeRisk: baselineRisk,
      afterRisk: baselineRisk,
      beforeReliability: baseline.reliabilityResult.score,
      afterReliability: baseline.reliabilityResult.score,
      actions: [],
      disclaimer:
        'Mevcut bilgilerle hedef aralığa ulaşan güvenli bir iyileştirme yolu bulunamadı; ayrıntılı inceleme gerekir.',
    };
  }

  return {
    achievable: true,
    targetScore,
    beforeScore: baselineScore,
    afterScore: best.result.overallScore,
    beforeRisk: baselineRisk,
    afterRisk: best.result.riskLevel,
    beforeReliability: baseline.reliabilityResult.score,
    afterReliability: best.result.reliabilityResult.score,
    actions: best.actions,
    disclaimer:
      'Bu iyileştirme planı kredi önerisi değildir. Yalnızca doğrulanması gereken olası adımları gösterir.',
  };
}

export function runDecisionCouncil(producer: Producer): DecisionCouncilResult {
  const score = calculateAgriScore(producer);
  const verifiedSources = producer.dataSources.filter(
    (source) => source.status === 'doğrulandı'
  );
  const evidenceCoverage = producer.dataSources.length > 0
    ? Math.round((verifiedSources.length / producer.dataSources.length) * 100)
    : 0;

  const scenarioResults = RESILIENCE_SCENARIOS.map((scenario) =>
    calculateScenario(producer, scenario)
  );
  const incompleteScenarios = scenarioResults.filter(
    (scenario) => scenario.newDscr === null
  );
  const unsafeScenarios = scenarioResults.filter(
    (scenario) => scenario.newDscr !== null && scenario.newDscr < 1.25
  );
  const finiteDscrValues = scenarioResults
    .map((scenario) => scenario.newDscr)
    .filter((value): value is number =>
      value !== null && Number.isFinite(value) && value !== 999
    );
  const minimumScenarioDscr = finiteDscrValues.length > 0
    ? Math.min(...finiteDscrValues)
    : null;

  const opportunityMatches = opportunities
    .map((opportunity) => calculateOpportunityMatch(producer, opportunity))
    .sort((left, right) => right.matchScore - left.matchScore);
  const topOpportunity = opportunityMatches[0];
  const counterfactualPlan = buildCounterfactualPlan(producer, score);

  const evidenceAgent: CouncilAgentResult = {
    id: 'evidence',
    title: 'Belge ve Veri',
    status:
      score.reliabilityResult.score < 80 ? 'requires_review' : 'completed',
    confidence:
      score.reliabilityResult.score >= 80
        ? 'yüksek'
        : score.reliabilityResult.score >= 50
          ? 'orta'
          : 'düşük',
    summary: `${producer.dataSources.length} kaynağın ${verifiedSources.length} adedi doğrulanmış; kapsam %${evidenceCoverage}, birleşik güvenilirlik %${score.reliabilityResult.score}.`,
    evidence: [
      ...verifiedSources.map((source) => `${source.name}: doğrulandı (${source.date})`),
      ...score.reliabilityResult.missingData,
      ...score.reliabilityResult.verificationNeeded,
    ],
    limitations: [
      'Bu çalışma alanındaki kaynak durumları örnek kayıtlardır; resmi kurum doğrulaması yerine geçmez.',
    ],
    methodology: 'reliability-engine-v1 + verified-source-only',
  };

  const riskAgent: CouncilAgentResult = {
    id: 'risk',
    title: 'Finansal Görünüm',
    status:
      score.assessmentStatus === 'Eksik Bilgi'
      || score.riskLevel === 'Yüksek'
      || score.reliabilityResult.score < 80
        ? 'requires_review'
        : 'completed',
    confidence:
      score.reliabilityResult.score >= 80
        ? 'yüksek'
        : score.reliabilityResult.score >= 50
          ? 'orta'
          : 'düşük',
    summary: score.overallScore === null
      ? `Finansal skor hesaplanamadı; tamamlanması gereken bilgiler: ${score.missingCriticalData.join(', ')}.`
      : `Skor ${score.overallScore}/100 (${score.riskLevel}); aylık işletme kazancı ${formatCurrency(score.operatingIncome)}, ödeme kapasitesi ${score.currentDscr === null ? 'kayıtlı taksit yok' : score.currentDscr.toFixed(2)}.`,
    evidence: [
      score.safeInstallmentRange.min === null
        || score.safeInstallmentRange.max === null
        ? 'Yeni taksit için korumalı aralık hesaplanamadı.'
        : `Yeni taksit için korumalı aralık: ${formatCurrency(score.safeInstallmentRange.min)}–${formatCurrency(score.safeInstallmentRange.max)}.`,
      ...score.positiveSignals,
      ...score.riskWarnings,
    ],
    limitations: [
      'Skor gerçek temerrüt etiketiyle kalibre edilmemiştir.',
      'Kredi onayı veya ret kararı üretmez.',
    ],
    methodology: score.methodologyVersion,
  };

  const resilienceAgent: CouncilAgentResult = {
    id: 'resilience',
    title: 'Değişen Koşullara Dayanıklılık',
    status:
      unsafeScenarios.length > 0 || incompleteScenarios.length > 0
        ? 'requires_review'
        : 'completed',
    confidence:
      producer.productionHistory.length >= 6 ? 'orta' : 'düşük',
    summary: `${scenarioResults.length} koşul değişikliği incelendi; ${unsafeScenarios.length} durumda ödeme gücü korumalı seviyenin altına indi${incompleteScenarios.length > 0 ? `, ${incompleteScenarios.length} sonuç eksik veri nedeniyle hesaplanamadı` : ''}${minimumScenarioDscr === null ? '' : `, en düşük değer ${minimumScenarioDscr.toFixed(2)}`}.`,
    evidence: scenarioResults.map(
      (scenario) =>
        `${scenario.scenarioName}: ${scenario.riskImpact}; borç sonrası nakit ${formatCurrency(scenario.newNetCashFlow)}.`
    ),
    limitations: [
      'Koşul değişiklikleri piyasa tahmini değildir.',
      'Birden fazla olumsuzluğun aynı anda yaşanması ayrıca değerlendirilmelidir.',
    ],
    methodology: 'deterministic-scenario-engine-v1',
  };

  const opportunityAgent: CouncilAgentResult = {
    id: 'opportunity',
    title: 'Destek Hazırlığı',
    status:
      !topOpportunity || topOpportunity.missingRequirements.length > 0
        ? 'requires_review'
        : 'completed',
    confidence: 'orta',
    summary: topOpportunity
      ? `En güçlü örnek program eşleşmesi “${topOpportunity.opportunity.title}” için ${topOpportunity.matchScore}/100; durum: ${topOpportunity.verificationStatus}.`
      : 'Değerlendirilebilir destek kaydı bulunamadı.',
    evidence: topOpportunity
      ? [
          ...topOpportunity.strongPoints,
          ...topOpportunity.missingRequirements,
        ]
      : [],
    limitations: [
      'Programlar örnek çalışma alanına aittir; güncel resmi çağrı metni ayrıca doğrulanmalıdır.',
      'Eksik veya bekleyen belge olumlu kanıt sayılmaz.',
    ],
    methodology: 'structured-opportunity-rules-v1',
  };

  const recourseAgent: CouncilAgentResult = {
    id: 'recourse',
    title: 'Sonraki Adımlar',
    status:
      !counterfactualPlan.achievable
      || counterfactualPlan.actions.length > 0
        ? 'requires_review'
        : 'completed',
    confidence:
      counterfactualPlan.achievable && score.reliabilityResult.score >= 50
        ? 'orta'
        : 'düşük',
    summary: counterfactualPlan.achievable
      ? counterfactualPlan.actions.length === 0
        ? 'Profil mevcut tanımlı hedef bandı karşılıyor; ek bir sayısal müdahale aranmadı.'
        : `${counterfactualPlan.actions.length} doğrulanabilir adım tamamlanırsa skorun ${counterfactualPlan.beforeScore} → ${counterfactualPlan.afterScore} aralığına ilerleyebileceği hesaplandı.`
      : `Hedef ${counterfactualPlan.targetScore}/100 için mevcut bilgilerle güvenli bir yol bulunamadı.`,
    evidence: counterfactualPlan.actions.map((action) => action.label),
    limitations: [
      counterfactualPlan.disclaimer,
      'Kimlik, konum, işletme tipi ve sürü varlığı gibi değiştirilemez alanlar arama uzayına alınmaz.',
    ],
    methodology: 'bounded-counterfactual-search-v1',
  };

  const agents = [
    evidenceAgent,
    riskAgent,
    resilienceAgent,
    opportunityAgent,
    recourseAgent,
  ];
  const disagreements: string[] = [];

  if (
    score.riskLevel !== null
    && score.riskLevel === 'Düşük'
    && score.reliabilityResult.score < 80
  ) {
    disagreements.push(
      'Risk skoru düşük görünse de belge ve veri güvenilirliği yeterli seviyede değil.'
    );
  }
  if (
    score.riskLevel !== null
    && score.riskLevel !== 'Yüksek'
    && unsafeScenarios.length > 0
  ) {
    disagreements.push(
      'Mevcut skor yüksek risk göstermese de en az bir koşul değişikliğinde ödeme gücü korumalı seviyenin altına iniyor.'
    );
  }
  if (
    topOpportunity?.matchScore
    && topOpportunity.matchScore >= 75
    && topOpportunity.missingRequirements.length > 0
  ) {
    disagreements.push(
      'Destek eşleşmesi güçlü görünse de eksik belgeler nedeniyle resmi uygunluk doğrulanamıyor.'
    );
  }

  const humanReviewRequired = agents.some(
    (agent) => agent.status === 'requires_review'
  );
  const reviewPriority =
    score.assessmentStatus === 'Eksik Bilgi'
    || score.reliabilityResult.score < 50
      ? 'Veri Tamamlama Öncelikli'
      : score.riskLevel === 'Yüksek'
        ? 'Yoğun Uzman İncelemesi'
        : unsafeScenarios.length > 0
          || incompleteScenarios.length > 0
          || disagreements.length > 0
          ? 'Koşullu İnceleme'
          : 'Standart Uzman İncelemesi';

  const consensusStatement =
    reviewPriority === 'Veri Tamamlama Öncelikli'
      ? 'Finansal değerlendirmeden önce eksik ve bekleyen belgeler tamamlanmalı.'
      : reviewPriority === 'Yoğun Uzman İncelemesi'
        ? 'Risk ve dayanıklılık uyarıları nedeniyle dosya ayrıntılı incelenmeli.'
        : reviewPriority === 'Koşullu İnceleme'
          ? 'Mevcut görünüm ile belge veya değişen koşul sonuçları arasındaki farklar açıklığa kavuşturulmalı.'
          : 'Dosya standart incelemeye hazır görünüyor; sonuç nihai bir karar değildir.';

  return {
    orchestrationVersion: 'council-v1.0',
    methodologyVersion: score.methodologyVersion,
    producerId: producer.id,
    score,
    agents,
    counterfactualPlan,
    humanReviewRequired,
    reviewPriority,
    consensusStatement,
    disagreements,
    trace: [
      {
        stage: 1,
        agents: ['evidence'],
        dependsOn: [],
        description: 'Belgeler ve veri güvenilirliği kontrol edilir.',
      },
      {
        stage: 2,
        agents: ['risk', 'resilience', 'opportunity'],
        dependsOn: ['evidence'],
        description: 'Finansal görünüm, dayanıklılık ve destek hazırlığı birlikte değerlendirilir.',
      },
      {
        stage: 3,
        agents: ['recourse'],
        dependsOn: ['evidence', 'risk'],
        description: 'Dosyayı güçlendirecek doğrulanabilir sonraki adımlar sıralanır.',
      },
    ],
  };
}
