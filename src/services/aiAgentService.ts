import type { Producer, ScoreResult, ForecastResult, AIReportResult } from '../types';

export const generateAINarrative = (
  producer: Producer, 
  score: ScoreResult, 
  forecast: ForecastResult
): AIReportResult => {

  const positives = [...score.positiveSignals];
  const negatives = [...score.riskWarnings];

  let summary = `AgriScore AI, ${producer.name} adlı üreticinin son ${producer.productionHistory.length} aylık beyan ve resmi kayıt örneklerini analiz etmiştir. `;

  // Inject Farm Memory
  if (producer.farmMemory) {
    summary += `[İşletme Hafızası: ${producer.farmMemory}] `;
  }

  if (score.riskLevel === 'Düşük') {
    summary += `Sistem, işletmenin finansal ve üretim performansını güçlü olarak sınıflandırmaktadır. Finansal karar süreçlerinde olumlu bir referans teşkil edebilir. `;
  } else if (score.riskLevel === 'Orta') {
    summary += `İşletme genel olarak sürdürülebilir bir performans sergilese de bazı izlenmesi gereken risk faktörleri barındırmaktadır. Kredi veya fon sağlama kararlarında ek doğrulama yapılması tavsiye edilir. `;
  } else {
    summary += `DİKKAT: Sistemsel analiz, işletmenin nakit akışı, borçluluk yapısı veya üretim verilerinde yüksek risk sinyalleri tespit etmiştir. `;
  }

  // Integrate forecast data into narrative
  if (forecast.predictions.length > 0) {
    const firstPrediction = forecast.predictions[0].predictedLiters;
    const lastPrediction = forecast.predictions[forecast.predictions.length - 1].predictedLiters;
    const direction = lastPrediction > firstPrediction ? 'artış' : lastPrediction < firstPrediction ? 'düşüş' : 'yatay';
    summary += `\n\nModel Öngörüsü: Geçmiş veri seti üzerinden yapılan hesaplamalara göre, önümüzdeki ${forecast.predictions.length} aylık dönemde üretimin ${direction} yönünde seyretmesi ihtimali bulunmaktadır. `;
    
    if (forecast.confidenceLevel < 70) {
      negatives.push(`Veri seti sınırlı olduğu için sistemin gelecek verim projeksiyon güvenilirliği düşük seviyededir (%${forecast.confidenceLevel}).`);
    } else {
      positives.push(`Gelecek verim projeksiyonu matematiksel modele dayalı olarak istikrarlı bir trend göstermektedir.`);
    }
  } else {
    summary += `\n\nModel Öngörüsü: Yeterli geçmiş veri bulunmadığından üretim trendi hesaplanamamıştır. `;
    negatives.push('Gelecek verim tahmini üretilecek yeterli geçmiş veri seti mevcut değildir.');
  }

  // Cash flow narrative
  const netCashFlow = producer.financials.monthlyMilkRevenue - producer.financials.monthlyFeedCost - producer.financials.monthlyOtherCosts;
  const netAfterDebt = netCashFlow - producer.financials.currentLoanInstallments;
  if (netAfterDebt > 0) {
    summary += `Mevcut hesaplamalara göre borç taksitlerinden sonra kalan aylık net nakit akışı pozitif değerdedir. `;
  } else if (producer.financials.currentLoanInstallments > 0) {
    summary += `Mevcut finansal yükümlülükler (kredi taksitleri) düşüldüğünde işletmenin net nakit akışının negatife döndüğü hesaplanmıştır. `;
  }

  // Reliability integration
  const rel = score.reliabilityResult;
  if (rel.score < 80) {
    summary += `\n\nSİSTEM UYARISI (Veri Güvenilirliği Skoru: %${rel.score}): Üretici profili oluşturulurken eksik veya doğrulanmamış veriler saptanmıştır. İlgili kurumun sahada ek teyit yapması önerilir.`;
    if (rel.missingData.length > 0) {
       summary += `\nEksikler: ${rel.missingData.join(' | ')}`;
    }
    if (rel.verificationNeeded.length > 0) {
       summary += `\nDoğrulanması Gerekenler: ${rel.verificationNeeded.join(' | ')}`;
    }
    negatives.push(`Veri güvenilirliği %${rel.score} seviyesinde kaldığı için sistem risk skorunu ihtiyatlı hesaplamıştır.`);
  } else {
    positives.push(`Sunulan veri setinin sistem içi tutarlılık oranı (Güvenilirlik Skoru: %${rel.score}) yüksektir.`);
  }

  summary += `\n\nYASAL UYARI: Bu rapor, mevcut veriler üzerinden risk ve potansiyel analizleri sunan bir karar destek aracıdır. Nihai tahsis onayı veya reddi, işlemi gerçekleştiren finans kurumunun veya değerlendirici merciin kendi politikalarına ve inisiyatifine aittir.`;

  return {
    summary,
    positiveFactors: positives.length > 0 ? positives : ['Belirgin bir pozitif sinyal tespit edilemedi.'],
    negativeFactors: negatives.length > 0 ? negatives : ['Sistematik bir risk faktörü gözlemlenmedi.'],
    architecturalNote: "MİMARİ NOT: Bu alan, AgriScore'un ileride LLM (Geniş Dil Modeli) ve Vektör Veritabanı entegrasyonu ile otomatik RAG (Retrieval-Augmented Generation) kullanarak çalışması için bir Placeholder (Yer tutucu) olarak tasarlanmıştır. Mevcut sürümde kural tabanlı (rule-based) deterministik risk naratifi üretilmektedir."
  };
};
