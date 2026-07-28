import type { Producer, ScoreResult, ForecastResult, AIReportResult } from '../types';

export const generateAINarrative = (
  producer: Producer, 
  score: ScoreResult, 
  forecast: ForecastResult
): AIReportResult => {

  const positives = [...score.positiveSignals];
  const negatives = [...score.riskWarnings];

  let summary = `AgriScore, ${producer.name} için son ${producer.productionHistory.length} aylık beyan ve kayıt örneklerini değerlendirmiştir. `;

  // Inject Farm Memory
  if (producer.farmMemory) {
    summary += `[İşletme Hafızası: ${producer.farmMemory}] `;
  }

  if (score.assessmentStatus === 'Eksik Bilgi') {
    summary += `Finansal skor hesaplanmadı. Tamamlanması gereken bilgiler: ${score.missingCriticalData.join(', ')}. `;
  } else if (score.riskLevel === 'Düşük') {
    summary += `İşletmenin finansal ve üretim görünümü güçlüdür. Bu sonuç yalnızca değerlendirmeye yardımcı olur. `;
  } else if (score.riskLevel === 'Orta') {
    summary += `İşletme genel olarak sürdürülebilir bir performans sergilese de bazı izlenmesi gereken risk faktörleri barındırmaktadır. Kredi veya fon sağlama kararlarında ek doğrulama yapılması tavsiye edilir. `;
  } else if (score.riskLevel === 'Yüksek') {
    summary += `DİKKAT: İşletmenin nakit akışı, borçluluk yapısı veya üretim verilerinde yüksek risk uyarıları bulunuyor. `;
  }

  // Integrate forecast data into narrative
  if (forecast.predictions.length > 0) {
    const firstPrediction = forecast.predictions[0].predictedLiters;
    const lastPrediction = forecast.predictions[forecast.predictions.length - 1].predictedLiters;
    const direction = lastPrediction > firstPrediction ? 'artış' : lastPrediction < firstPrediction ? 'düşüş' : 'yatay';
    summary += `\n\nÜretim görünümü: Geçmiş kayıtlara göre önümüzdeki ${forecast.predictions.length} aylık dönemde üretimin ${direction} yönünde seyretmesi bekleniyor. `;
    
    if (forecast.confidenceLevel < 70) {
      negatives.push(`Geçmiş kayıtlar sınırlı olduğu için gelecek üretim görünümünün güvenilirliği düşüktür (%${forecast.confidenceLevel}).`);
    } else {
      positives.push('Geçmiş üretim kayıtları istikrarlı bir eğilim gösteriyor.');
    }
  } else {
    summary += `\n\nÜretim görünümü: Yeterli geçmiş kayıt bulunmadığından üretim eğilimi hesaplanamadı. `;
    negatives.push('Gelecek üretim görünümü için yeterli geçmiş kayıt bulunmuyor.');
  }

  // Cash flow narrative
  const netCashFlow = producer.financials.monthlyOtherCosts === null
    ? null
    : producer.financials.monthlyMilkRevenue
      - producer.financials.monthlyFeedCost
      - producer.financials.monthlyOtherCosts;
  const netAfterDebt = netCashFlow === null
    || producer.financials.currentLoanInstallments === null
    ? null
    : netCashFlow - producer.financials.currentLoanInstallments;
  if (netAfterDebt === null) {
    summary += 'Diğer gider veya mevcut taksit bilgisi eksik olduğu için borç sonrası nakit hesaplanamadı. ';
  } else if (netAfterDebt > 0) {
    summary += `Mevcut hesaplamalara göre borç taksitlerinden sonra kalan aylık net nakit akışı pozitif değerdedir. `;
  } else if (
    producer.financials.currentLoanInstallments !== null
    && producer.financials.currentLoanInstallments > 0
  ) {
    summary += `Mevcut finansal yükümlülükler (kredi taksitleri) düşüldüğünde işletmenin net nakit akışının negatife döndüğü hesaplanmıştır. `;
  }

  // Reliability integration
  const rel = score.reliabilityResult;
  if (rel.score < 80) {
    summary += `\n\nVeri uyarısı (Güvenilirlik: %${rel.score}): Üretici profilinde eksik veya doğrulanmamış bilgiler bulunuyor. Ek teyit önerilir.`;
    if (rel.missingData.length > 0) {
       summary += `\nEksikler: ${rel.missingData.join(' | ')}`;
    }
    if (rel.verificationNeeded.length > 0) {
       summary += `\nDoğrulanması Gerekenler: ${rel.verificationNeeded.join(' | ')}`;
    }
    negatives.push(`Veri güvenilirliği %${rel.score} seviyesinde kaldığı için sonuçlar ek kayıtlarla doğrulanmalıdır.`);
  } else {
    positives.push(`Sunulan kayıtların güvenilirlik skoru %${rel.score} ile yüksek seviyededir.`);
  }

  summary += `\n\nÖnemli: Bu rapor mevcut kayıtlara dayalı bir değerlendirme desteğidir. Nihai finansman kararı ilgili kurumun kendi incelemesine aittir.`;

  return {
    summary,
    positiveFactors: positives.length > 0 ? positives : ['Belirgin bir pozitif sinyal tespit edilemedi.'],
    negativeFactors: negatives.length > 0 ? negatives : ['Sistematik bir risk faktörü gözlemlenmedi.'],
    architecturalNote: 'Dosyanın ayrıntılarını ve sonraki adımları görmek için Risk ve Analiz ekranını kullanabilirsiniz.'
  };
};
