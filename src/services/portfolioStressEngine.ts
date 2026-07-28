import type { Producer } from '../types';
import { calculateAgriScore } from './scoreEngine';

export type PortfolioStressType = 'feed20' | 'milk10' | 'disease15';

export interface PortfolioStressResult {
  title: string;
  desc: string;
  impacts: string[];
}

const stressProducer = (producer: Producer, type: PortfolioStressType): Producer => {
  const clone: Producer = {
    ...producer,
    financials: { ...producer.financials },
    productionHistory: producer.productionHistory.map((record) => ({ ...record })),
    riskNotes: [...producer.riskNotes],
  };

  if (type === 'feed20') {
    clone.financials.monthlyFeedCost *= 1.2;
  } else if (type === 'milk10') {
    clone.financials.monthlyMilkRevenue *= 0.9;
  } else {
    clone.financials.monthlyMilkRevenue *= 0.85;
    if (clone.financials.monthlyOtherCosts !== null) {
      clone.financials.monthlyOtherCosts *= 1.4;
    }
    clone.productionHistory = clone.productionHistory.map((record) => ({
      ...record,
      totalLiters: record.totalLiters * 0.85,
    }));
    clone.riskNotes.push('Hastalık senaryosu: operasyonel sağlık riski.');
  }

  return clone;
};

export function calculatePortfolioStress(
  producers: Producer[],
  type: PortfolioStressType
): PortfolioStressResult {
  const baseline = producers.map((producer) => ({
    producer,
    score: calculateAgriScore(producer),
  }));
  const stressed = producers.map((producer) => {
    const stressedProducer = stressProducer(producer, type);
    return {
      producer: stressedProducer,
      score: calculateAgriScore(stressedProducer),
    };
  });

  const average = (values: Array<number | null>) => {
    const available = values.filter((value): value is number => value !== null);
    return available.length
      ? Math.round(available.reduce((sum, value) => sum + value, 0) / available.length)
      : null;
  };
  const baselineAverage = average(baseline.map((item) => item.score.overallScore));
  const stressedAverage = average(stressed.map((item) => item.score.overallScore));
  const highRiskCount = stressed.filter((item) => item.score.riskLevel === 'Yüksek').length;
  const incompleteCount = stressed.filter(
    (item) => item.score.assessmentStatus === 'Eksik Bilgi'
  ).length;
  const transitionsToHigh = stressed.filter((item, index) =>
    item.score.riskLevel === 'Yüksek' && baseline[index].score.riskLevel !== 'Yüksek'
  ).length;
  const completeCashflowProfiles = stressed.filter(
    (item) =>
      item.score.operatingIncome !== null
      && item.producer.financials.currentLoanInstallments !== null
  );
  const negativeAfterDebt = completeCashflowProfiles.filter((item) =>
    item.score.operatingIncome! - item.producer.financials.currentLoanInstallments! < 0
  ).length;

  const commonImpacts = [
    `Ortalama skor: ${baselineAverage ?? 'hesaplanamadı'} → ${stressedAverage ?? 'hesaplanamadı'}`,
    `Yüksek riskli profil: ${highRiskCount}; yeni yüksek riske geçen: ${transitionsToHigh}`,
    `Borç sonrası nakdi negatif profil: ${negativeAfterDebt}/${completeCashflowProfiles.length} (verisi tam profiller); eksik bilgili profil: ${incompleteCount}`,
  ];

  if (type === 'feed20') {
    return {
      title: 'Yem Maliyetleri %20 Artarsa',
      desc: 'Örnek çalışma alanındaki işletmelerde yalnızca aylık yem gideri %20 artırılarak sonuçlar yeniden hesaplandı.',
      impacts: commonImpacts,
    };
  }
  if (type === 'milk10') {
    return {
      title: 'Çiğ Süt Geliri %10 Düşerse',
      desc: 'Örnek çalışma alanındaki işletmelerde aylık süt geliri %10 azaltılarak sonuçlar yeniden hesaplandı.',
      impacts: commonImpacts,
    };
  }
  return {
    title: 'Sürü Sağlığı Şoku Varsayımı',
    desc: 'Varsayım: süt geliri %15 azalır, diğer giderler %40 artar ve operasyonel sağlık riski eklenir. Resmî salgın tahmini değildir.',
    impacts: commonImpacts,
  };
}
