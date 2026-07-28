import type { Producer } from '../types';
import { runDecisionCouncil } from './decisionCouncilEngine';
import { calculateForecast } from './forecastEngine';
import { calculateAgriScore } from './scoreEngine';

export type CopilotContext = Producer | Producer[] | null;

export interface LocalCopilotResponse {
  text: string;
  mode: 'local_deterministic';
}

const formatCurrency = (value: number | null) =>
  value === null
    ? 'bilinmiyor'
    : new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
      }).format(value);

const includesAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

export function getLocalCopilotReply(
  message: string,
  context: CopilotContext
): LocalCopilotResponse {
  const normalizedMessage = message.toLocaleLowerCase('tr-TR');

  if (!context) {
    return {
      mode: 'local_deterministic',
      text: 'Bu ekranda açıklayabileceğim bir işletme veya portföy kaydı bulunmuyor.',
    };
  }

  if (Array.isArray(context)) {
    if (context.length === 0) {
      return {
        mode: 'local_deterministic',
        text: 'Portföyde henüz değerlendirilebilecek bir işletme kaydı bulunmuyor.',
      };
    }

    const scored = context.map((producer) => ({
      producer,
      score: calculateAgriScore(producer),
    }));
    const availableScores = scored
      .map((item) => item.score.overallScore)
      .filter((value): value is number => value !== null);
    const averageScore = availableScores.length
      ? Math.round(
          availableScores.reduce((sum, value) => sum + value, 0)
          / availableScores.length
        )
      : null;
    const averageReliability = Math.round(
      scored.reduce((sum, item) => sum + item.score.reliabilityResult.score, 0) / scored.length
    );
    const totalRequest = context.reduce(
      (sum, producer) => sum + producer.financials.requestedLoanAmount,
      0
    );
    const riskCounts = scored.reduce(
      (counts, item) => {
        if (item.score.riskLevel === null) {
          counts.Hesaplanamadı += 1;
        } else {
          counts[item.score.riskLevel] += 1;
        }
        return counts;
      },
      { Düşük: 0, Orta: 0, Yüksek: 0, Hesaplanamadı: 0 }
    );
    const incompleteCount = scored.filter(
      (item) => item.score.assessmentStatus === 'Eksik Bilgi'
    ).length;

    if (
      includesAny(normalizedMessage, [
        'inceleme öncelikli',
        'öncelikli',
        'yakın takip',
        'hangi profil',
        'hangi üretici',
        'riskli profil',
        'riskli üretici',
      ])
    ) {
      const reviewList = scored
        .filter((item) =>
          item.score.riskLevel === null
          || item.score.riskLevel !== 'Düşük'
          || item.score.reliabilityResult.score < 80
        )
        .sort(
          (a, b) =>
            (a.score.overallScore ?? Number.NEGATIVE_INFINITY)
            - (b.score.overallScore ?? Number.NEGATIVE_INFINITY)
        )
        .map((item) =>
          `${item.producer.name} (${item.score.overallScore === null ? 'skor hesaplanmadı' : `${item.score.overallScore}/100`}, güvenilirlik %${item.score.reliabilityResult.score})`
        );
      return {
        mode: 'local_deterministic',
        text: `İnceleme önceliği ${reviewList.length ? reviewList.join('; ') : 'bulunmuyor'}. Bu liste bilgilendirme amaçlıdır.`,
      };
    }

    return {
      mode: 'local_deterministic',
      text: `${context.length} örnek işletme profili bulunuyor. Hesaplanabilen dosyalarda ortalama skor ${averageScore === null ? 'bulunmuyor' : `${averageScore}/100`}, ortalama veri güvenilirliği %${averageReliability}. Risk dağılımı: düşük ${riskCounts.Düşük}, orta ${riskCounts.Orta}, yüksek ${riskCounts.Yüksek}; eksik bilgi nedeniyle hesaplanamayan ${incompleteCount}. Toplam finansman talebi ${formatCurrency(totalRequest)}.`,
    };
  }

  const score = calculateAgriScore(context);
  const financials = context.financials;
  const afterDebt = score.operatingIncome === null
    || financials.currentLoanInstallments === null
    ? null
    : score.operatingIncome - financials.currentLoanInstallments;

  if (includesAny(normalizedMessage, [
    'kanıt konseyi',
    'ajanlar neden',
    'uzman incelemesi',
    'çoklu risk',
    'dosya değerlendirme',
    'ayrıntılı inceleme',
  ])) {
    const council = runDecisionCouncil(context);
    const reviewAreaCount = council.agents.filter(
      (agent) => agent.status === 'requires_review'
    ).length;
    const recourse = council.counterfactualPlan;
    return {
      mode: 'local_deterministic',
      text: `Dosya değerlendirme özeti: ${council.reviewPriority}. ${council.consensusStatement} ${reviewAreaCount}/5 değerlendirme alanı ayrıntılı inceleme istiyor; açıklığa kavuşturulacak konu sayısı ${council.disagreements.length}. ${recourse.actions.length > 0 ? `${recourse.actions.length} doğrulanabilir adım tamamlanırsa skor ${recourse.beforeScore} → ${recourse.afterScore} aralığına ilerleyebilir.` : recourse.disclaimer}`,
    };
  }

  if (includesAny(normalizedMessage, ['risk', 'kredi', 'uygun', 'hazır', 'ödeme'])) {
    if (score.assessmentStatus === 'Eksik Bilgi') {
      return {
        mode: 'local_deterministic',
        text: `${context.name} için finansal skor ve ödeme kapasitesi hesaplanmadı. Tamamlanması gereken bilgiler: ${score.missingCriticalData.join(', ')}. Veri güvenilirliği %${score.reliabilityResult.score}.`,
      };
    }
    const warning = score.riskWarnings[0]
      ? `Öncelikli uyarı: ${score.riskWarnings[0]}`
      : 'Belirgin bir kural uyarısı oluşmadı.';
    return {
      mode: 'local_deterministic',
      text: `${context.name} profili ${score.overallScore}/100 (${score.riskLevel} risk), veri güvenilirliği %${score.reliabilityResult.score}. Borç sonrası aylık nakit ${formatCurrency(afterDebt)}; yeni taksit için korumalı aralık ${formatCurrency(score.safeInstallmentRange.min)}–${formatCurrency(score.safeInstallmentRange.max)}. ${warning} Bu sonuç bilgilendirme amaçlıdır; kredi onayı veya reddi değildir.`,
    };
  }

  if (includesAny(normalizedMessage, ['nakit', 'maliyet', 'gider', 'gelir'])) {
    const totalCosts = financials.monthlyOtherCosts === null
      ? null
      : financials.monthlyFeedCost + financials.monthlyOtherCosts;
    return {
      mode: 'local_deterministic',
      text: `Aylık gelir ${formatCurrency(financials.monthlyMilkRevenue)}, işletme gideri ${formatCurrency(totalCosts)}, mevcut taksit ${formatCurrency(financials.currentLoanInstallments)} ve borç sonrası nakit ${formatCurrency(afterDebt)}.`,
    };
  }

  if (includesAny(normalizedMessage, ['süt', 'verim', 'üretim', 'sağlık'])) {
    const forecast = calculateForecast(context);
    const latest = context.productionHistory.at(-1);
    const next = forecast.predictions[0];
    return {
      mode: 'local_deterministic',
      text: `Son kayıt ${latest ? `${latest.month} için ${latest.totalLiters.toLocaleString('tr-TR')} litre` : 'bulunmuyor'}. ${next ? `İlk üretim görünümü ${next.month} için ${next.predictedLiters.toLocaleString('tr-TR')} litre.` : forecast.riskNote} ${forecast.trendExplanation}`,
    };
  }

  if (includesAny(normalizedMessage, ['hibe', 'destek', 'teşvik', 'faiz'])) {
    return {
      mode: 'local_deterministic',
      text: 'AgriScore resmi destek uygunluğu ilan etmez. Destek ekranındaki programlar örnek çalışma alanına aittir; TKDK ve ilgili resmi kurumların güncel çağrı metinleri ayrıca doğrulanmalıdır.',
    };
  }

  return {
    mode: 'local_deterministic',
    text: score.overallScore === null
      ? `${context.name} için finansal skor hesaplanmadı. Tamamlanması gereken bilgiler: ${score.missingCriticalData.join(', ')}.`
      : `${context.name} profilinin skoru ${score.overallScore}/100, risk seviyesi ${score.riskLevel}, veri güvenilirliği %${score.reliabilityResult.score}.`,
  };
}
