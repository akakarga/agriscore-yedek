import type { Opportunity, OpportunityMatch, Producer } from '../types';
import { calculateAgriScore } from './scoreEngine';

const normalize = (value: string) =>
  value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const documentIsVerified = (producer: Producer, requiredDocument: string) => {
  const required = normalize(requiredDocument);
  return producer.dataSources.some((source) => {
    if (source.status !== 'doğrulandı') return false;
    const sourceName = normalize(source.name);
    return sourceName === required || sourceName.includes(required) || required.includes(sourceName);
  });
};

export function calculateOpportunityMatch(
  producer: Producer,
  opportunity: Opportunity
): OpportunityMatch {
  let score = 100;
  const strongPoints: string[] = [];
  const missingRequirements: string[] = [];
  const riskNotes: string[] = [];

  if (
    !opportunity.targetProducerType.includes('Tümü')
    && !opportunity.targetProducerType.includes(producer.businessType)
  ) {
    score -= 40;
    missingRequirements.push(`İşletme tipi (${producer.businessType}) hedef grupla uyuşmuyor.`);
  } else {
    strongPoints.push('İşletme tipi hedef grupla uyumlu.');
  }

  const producerProvince = producer.location.split(' / ')[0];
  if (
    !opportunity.region.includes('Tümü')
    && !opportunity.region.includes(producerProvince)
  ) {
    score -= 30;
    missingRequirements.push(`İşletme bölgesi (${producerProvince}) senaryo kapsamı dışında.`);
  } else {
    strongPoints.push('Bölgesel kapsam koşulu sağlanıyor.');
  }

  opportunity.requiredDocuments.forEach((requiredDocument) => {
    if (!documentIsVerified(producer, requiredDocument)) {
      score -= 10;
      missingRequirements.push(`${requiredDocument}: doğrulanmış belge bulunamadı.`);
    }
  });

  const scoreResult = calculateAgriScore(producer);
  const eligibility = opportunity.eligibility;
  if (eligibility.minDscr !== undefined) {
    if (producer.financials.currentLoanInstallments === null) {
      score -= 25;
      missingRequirements.push(
        'Mevcut taksit bilgisi eksik olduğu için ödeme kapasitesi doğrulanamıyor.'
      );
    } else if (
      scoreResult.currentDscr !== null
      && scoreResult.currentDscr < eligibility.minDscr
    ) {
      score -= 25;
      missingRequirements.push(
        `Ödeme kapasitesi ${scoreResult.currentDscr.toFixed(2)}; gerekli seviye ${eligibility.minDscr.toFixed(2)}.`
      );
    } else {
      strongPoints.push(
        scoreResult.currentDscr === null
          ? 'Kayıtlı mevcut taksit bulunmuyor.'
          : `Ödeme kapasitesi ${scoreResult.currentDscr.toFixed(2)} ile gerekli seviyenin üzerinde.`
      );
    }
  }

  if (
    eligibility.allowedRiskLevels
    && (
      scoreResult.riskLevel === null
      || !eligibility.allowedRiskLevels.includes(scoreResult.riskLevel)
    )
  ) {
    score -= 25;
    missingRequirements.push(
      scoreResult.riskLevel === null
        ? 'Eksik finansal bilgiler nedeniyle risk seviyesi hesaplanamadı.'
        : `Risk seviyesi (${scoreResult.riskLevel}) kabul edilen aralıkta değil.`
    );
  }

  if (
    eligibility.minimumReliability !== undefined
    && scoreResult.reliabilityResult.score < eligibility.minimumReliability
  ) {
    score -= 25;
    missingRequirements.push(
      `Veri güvenilirliği %${scoreResult.reliabilityResult.score}; gerekli eşik %${eligibility.minimumReliability}.`
    );
  }

  if (eligibility.minimumFeedRevenueRatio !== undefined) {
    const ratio = producer.financials.monthlyMilkRevenue > 0
      ? producer.financials.monthlyFeedCost / producer.financials.monthlyMilkRevenue
      : 0;
    if (ratio < eligibility.minimumFeedRevenueRatio) {
      score -= 25;
      missingRequirements.push(
        `Yem/gelir oranı %${Math.round(ratio * 100)}; öncelik eşiği %${Math.round(eligibility.minimumFeedRevenueRatio * 100)}.`
      );
    } else {
      strongPoints.push(`Yem/gelir oranı %${Math.round(ratio * 100)} ile öncelik eşiğini karşılıyor.`);
    }
  }

  if (eligibility.excludedRiskTerms?.length) {
    const combinedRiskNotes = normalize(producer.riskNotes.join(' '));
    const detectedTerms = eligibility.excludedRiskTerms.filter((term) =>
      combinedRiskNotes.includes(normalize(term))
    );
    if (detectedTerms.length) {
      score -= 35;
      missingRequirements.push(`Hariç tutulan risk sinyali bulundu: ${detectedTerms.join(', ')}.`);
    }
  }

  if (scoreResult.reliabilityResult.score < 70) {
    score -= 15;
    riskNotes.push('Düşük veri güvenilirliği eşleşme sonucunu sınırlandırıyor.');
  }

  score = Math.max(0, Math.min(100, score));

  let verificationStatus: OpportunityMatch['verificationStatus'] = 'Değerlendirilebilir';
  if (score >= 85 && missingRequirements.length === 0) {
    verificationStatus = 'Yüksek Uyum - Resmi Doğrulama Gerekli';
  } else if (missingRequirements.some((item) => item.includes('belge'))) {
    verificationStatus = 'Eksik Belge';
  } else if (score < 50) {
    verificationStatus = 'Doğrulama Gerekli';
  }

  const reasonForRecommendation = score >= 75
    ? 'Senaryo profili yapılandırılmış uygunluk kurallarını büyük ölçüde karşılıyor; resmi başvuru koşulları ayrıca doğrulanmalı.'
    : score >= 50
      ? 'Bazı belge veya uygunluk koşulları tamamlandığında eşleşme güçlenebilir.'
      : 'Senaryo profili mevcut yapılandırılmış koşulların önemli bölümünü karşılamıyor.';

  return {
    opportunity,
    matchScore: score,
    isHighlyEligible: score >= 75 && missingRequirements.length === 0,
    reasonForRecommendation,
    strongPoints,
    missingRequirements,
    verificationStatus,
    riskNote: riskNotes.join(' '),
  };
}
