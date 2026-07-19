import type { Producer, Opportunity, OpportunityMatch } from '../types';
import { calculateAgriScore } from './scoreEngine';

export function calculateOpportunityMatch(producer: Producer, opportunity: Opportunity): OpportunityMatch {
  let score = 100;
  const strongPoints: string[] = [];
  const missingRequirements: string[] = [];
  let riskNote = '';

  // 1. Target Producer Type Check
  if (!opportunity.targetProducerType.includes('Tümü') && !opportunity.targetProducerType.includes(producer.businessType)) {
    score -= 40;
    missingRequirements.push(`İşletme tipi (${producer.businessType}) bu fırsatın hedefleriyle uyuşmuyor.`);
  } else {
    strongPoints.push('İşletme tipi fırsat hedefleriyle tam uyumlu.');
  }

  // 2. Regional Check
  if (!opportunity.region.includes('Tümü') && !opportunity.region.some(r => producer.location.includes(r))) {
    score -= 30;
    missingRequirements.push(`İşletme bölgesi (${producer.location}) destek kapsamı dışında olabilir.`);
  } else {
    strongPoints.push('Bölgesel uygunluk kriteri sağlandı.');
  }

  // 3. Document Check (simulated based on data sources)
  const currentDocs = producer.dataSources.map(ds => ds.name.toLowerCase());
  opportunity.requiredDocuments.forEach(reqDoc => {
    // Basic fuzzy matching for simulated docs
    if (!currentDocs.some(cd => cd.includes(reqDoc.toLowerCase().split(' ')[0]))) {
      score -= 10;
      missingRequirements.push(`${reqDoc} belgesi sistemde eksik veya güncel değil.`);
    }
  });

  if (missingRequirements.length === 0) {
    strongPoints.push('Tüm temel evraklar sistemde doğrulanmış görünüyor.');
  }

  // 4. Specific Eligibility Rules using ScoreEngine
  const scoreResult = calculateAgriScore(producer);
  if (opportunity.type === 'Kredi' || opportunity.type === 'Faiz Desteği') {
    if (scoreResult.riskLevel === 'Yüksek') {
      score -= 50;
      riskNote = 'Yüksek risk profili finansman onayı için engel teşkil edebilir.';
    } else {
      strongPoints.push(`Risk skoru (${scoreResult.overallScore}) finansal destekler için uygun seviyede.`);
    }
    
    // Check DSCR indirectly
    if (scoreResult.subScores.debtBurden < 50) {
      score -= 20;
      riskNote = 'Mevcut borç yükü (DSCR) yeni finansman kapasitesini sınırlandırıyor.';
    }
  }

  if (opportunity.type === 'Hibe' || opportunity.type === 'Teşvik') {
    if (scoreResult.reliabilityResult.score < 70) {
      score -= 25;
      riskNote = 'Resmi hibe/teşvik başvuruları için veri güvenilirliğinin artırılması gerekli.';
    } else {
      strongPoints.push('Veri güvenilirliği hibe süreçleri için yeterli standartta.');
    }
  }

  // Cap Score
  score = Math.max(0, Math.min(100, score));

  let verificationStatus: OpportunityMatch['verificationStatus'] = 'Değerlendirilebilir';
  if (score >= 85 && missingRequirements.length === 0) {
    verificationStatus = 'Ön Onaylı Gibi';
  } else if (missingRequirements.length > 0) {
    verificationStatus = 'Eksik Belge';
  } else if (score < 50) {
    verificationStatus = 'Doğrulama Gerekli';
  }

  let reason = '';
  if (score >= 75) {
    reason = 'Üreticinin operasyonel ve finansal profili bu fırsatın temel şartlarını büyük ölçüde karşılıyor.';
  } else if (score >= 50) {
    reason = 'Bazı eksik belgeler veya risk faktörleri giderildiğinde uygunluk sağlanabilir.';
  } else {
    reason = 'Üretici profili bu fırsatın asgari uygunluk kriterlerinin altında kalıyor.';
  }

  return {
    opportunity,
    matchScore: score,
    isHighlyEligible: score >= 75,
    reasonForRecommendation: reason,
    strongPoints,
    missingRequirements,
    verificationStatus,
    riskNote
  };
}
