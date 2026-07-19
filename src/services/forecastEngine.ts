import type { Producer, ForecastResult } from '../types';

export const calculateForecast = (producer: Producer): ForecastResult => {
  const { productionHistory, herd, riskNotes } = producer;

  // Simple deterministic approach
  // We look at the trend of the last 6 months
  if (productionHistory.length < 3) {
    return {
      predictions: [],
      confidenceLevel: 30,
      trendExplanation: 'Yeterli geçmiş veri bulunamadığı için trend analizi yapılamamaktadır.',
      riskNote: 'Veri eksikliği nedeniyle tahmin güvenilirliği çok düşük.'
    };
  }

  const recent = productionHistory.slice(-3); // look at last 3 months for short-term trend
  const old = productionHistory.slice(0, 3);
  
  const recentAvg = recent.reduce((sum, r) => sum + r.totalLiters, 0) / recent.length;
  const oldAvg = old.length ? old.reduce((sum, r) => sum + r.totalLiters, 0) / old.length : recentAvg;

  let trendMultiplier = 1;
  let trendExplanation = 'Üretim stabil seyretmektedir.';
  
  if (recentAvg > oldAvg * 1.05) {
    trendMultiplier = 1.02; // Expected to grow slightly
    trendExplanation = 'Son aylarda üretimde pozitif bir artış trendi gözlemlenmiştir. Tahminler hafif büyüme beklentisiyle oluşturulmuştur.';
  } else if (recentAvg < oldAvg * 0.95) {
    trendMultiplier = 0.97; // Expected to decline slightly
    trendExplanation = 'Son aylarda üretimde düşüş trendi gözlemlenmiştir. Bu durum gelecek projeksiyonlarına negatif yansıtılmıştır.';
  }

  // Adjust by herd size changes conceptually (if heifers are high, we assume production capacity stays strong)
  const heiferRatio = herd.totalCattle > 0 ? herd.heifers / herd.totalCattle : 0;
  if (heiferRatio > 0.25) {
      trendMultiplier += 0.01;
      trendExplanation += ' Ayrıca yüksek düve oranı, sürü yenileme kapasitesinin güçlü olduğunu ve verimi destekleyeceğini göstermektedir.';
  }

  // Risk notes impact
  let confidenceLevel = 85;
  let riskNote = 'Düşük riskli projeksiyon.';

  if (riskNotes.some(n => n.toLowerCase().includes('mastitis') || n.toLowerCase().includes('salgın'))) {
    trendMultiplier -= 0.05;
    confidenceLevel = 60;
    riskNote = 'Sürü sağlığı sorunları (salgın/hastalık) nedeniyle üretimde belirsizlik yüksek. Tahminlere negatif şok payı eklenmiştir.';
  }
  
  if (riskNotes.some(n => n.toLowerCase().includes('volatilite') || n.toLowerCase().includes('dalgalanma'))) {
      confidenceLevel -= 15;
      riskNote = 'Geçmiş aylardaki yüksek dalgalanma nedeniyle tahmin güvenilirliği sınırlıdır.';
  }

  const lastMonthProduction = productionHistory[productionHistory.length - 1].totalLiters;
  
  const predictions = [];
  const monthNames = ["Tem 2026", "Ağu 2026", "Eyl 2026", "Eki 2026", "Kas 2026", "Ara 2026"];
  
  let currentPrediction = lastMonthProduction;
  for (let i = 0; i < 6; i++) {
    // Apply trend
    currentPrediction = currentPrediction * trendMultiplier;
    // Add some realistic but deterministic monthly variance based on the month index to avoid flat lines
    const seasonalFactor = 1 + (Math.sin(i) * 0.01); 
    currentPrediction = currentPrediction * seasonalFactor;

    predictions.push({
      month: monthNames[i],
      predictedLiters: Math.round(currentPrediction)
    });
  }

  return {
    predictions,
    confidenceLevel,
    trendExplanation,
    riskNote
  };
};
