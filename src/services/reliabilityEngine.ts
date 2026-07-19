import type { Producer, ReliabilityResult } from '../types';

export function calculateReliability(producer: Producer): ReliabilityResult {
  let score = 100;
  const missingData: string[] = [];
  const verificationNeeded: string[] = [];

  // 1. Check Production History (We expect 6 months)
  if (!producer.productionHistory || producer.productionHistory.length < 6) {
    const missingCount = 6 - (producer.productionHistory?.length || 0);
    score -= missingCount * 10;
    missingData.push(`${missingCount} aylık süt üretim verisi eksik.`);
  }

  // 2. Check Financials
  if (!producer.financials.monthlyMilkRevenue || producer.financials.monthlyMilkRevenue === 0) {
    score -= 15;
    missingData.push('Aylık süt geliri bilgisi girilmemiş.');
  }
  
  if (!producer.financials.monthlyFeedCost || producer.financials.monthlyFeedCost === 0) {
    score -= 10;
    missingData.push('Aylık yem gideri bilgisi eksik.');
  }

  if (producer.financials.monthlyOtherCosts === 0) {
    // Other costs can be 0, but usually it means missing data in this context. 
    // We won't penalize score but add a warning.
    verificationNeeded.push('Diğer giderler 0 TL girilmiş, teyit edilmeli.');
  }

  // 3. Check Data Sources / Documents
  if (!producer.dataSources || producer.dataSources.length === 0) {
    score -= 30;
    missingData.push('Sisteme yüklenmiş hiçbir veri kaynağı / belge yok.');
  } else {
    producer.dataSources.forEach(source => {
      if (source.status === 'eksik') {
        score -= 15;
        missingData.push(`Eksik Belge: ${source.name}`);
      } else if (source.status === 'bekliyor') {
        score -= 5;
        verificationNeeded.push(`Onay Bekleyen Belge: ${source.name}`);
      }
    });
  }

  // Floor the score at 0
  score = Math.max(0, score);

  let warningMessage = null;
  if (score < 50) {
    warningMessage = 'Kritik Uyarı: Veri güvenilirliği çok düşük seviyede. Sistem hesaplamaları yüksek sapma gösterebilir.';
  } else if (score < 80) {
    warningMessage = 'Uyarı: Eksik veya doğrulanmamış veriler mevcut. Karar sürecinde dikkatli olunmalı.';
  }

  return {
    score,
    missingData,
    verificationNeeded,
    warningMessage
  };
}
