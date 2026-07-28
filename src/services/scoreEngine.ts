import type { Producer, ScoreResult, RiskLevel } from '../types';
import { calculateReliability } from './reliabilityEngine';

export const calculateAgriScore = (producer: Producer): ScoreResult => {
  const { productionHistory, financials, herd, riskNotes } = producer;

  const warnings: string[] = [];
  const positiveSignals: string[] = [];

  // Calculate Reliability
  const reliabilityResult = calculateReliability(producer);

  // 1. Production Stability (20%)
  let productionStabilityScore = 0;
  if (productionHistory.length > 1) {
    const changes: number[] = [];
    for (let i = 1; i < productionHistory.length; i++) {
      const prev = productionHistory[i - 1].totalLiters;
      const curr = productionHistory[i].totalLiters;
      if (prev <= 0) continue;
      const pctChange = Math.abs((curr - prev) / prev);
      changes.push(pctChange);
      
      if ((curr - prev) / prev < -0.15) {
         warnings.push('Süt üretiminde ani düşüş tespit edildi.');
      }
    }
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    // Lower average change -> higher stability
    productionStabilityScore = Math.max(0, 100 - (avgChange * 500)); 
    if (productionStabilityScore > 80) positiveSignals.push('Süt üretimi istikrarlı.');
  } else {
    productionStabilityScore = 50; // Default mid-score for missing data
  }

  // 2. Cashflow Strength (20%)
  const totalRevenue = financials.monthlyMilkRevenue;
  const otherCosts = financials.monthlyOtherCosts;
  const currentInstallments = financials.currentLoanInstallments;
  const totalCosts = otherCosts === null
    ? null
    : financials.monthlyFeedCost + otherCosts;
  const netCashFlow = totalCosts === null ? null : totalRevenue - totalCosts;
  
  let cashflowStrengthScore: number | null = 0;
  if (netCashFlow === null) {
    cashflowStrengthScore = null;
    warnings.push('Diğer gider bilgisi eksik olduğu için nakit akışı tamamlanamadı.');
  } else if (netCashFlow > 0) {
    const margin = netCashFlow / totalRevenue;
    cashflowStrengthScore = Math.min(100, margin * 300); // 33% margin = 100 score
    if (cashflowStrengthScore > 80) positiveSignals.push('Nakit akışı güçlü ve sürdürülebilir.');
  } else {
    warnings.push('Negatif nakit akışı: Aylık giderler gelirleri aşıyor.');
  }

  // 3. Herd Strength (15%)
  const milkingRatio = herd.totalCattle > 0 ? herd.milkingCows / herd.totalCattle : 0;
  let herdStrengthScore = Math.min(100, milkingRatio * 150); // 66% milking ratio = 100 score
  
  if (herd.totalCattle > 0 && herd.heifers / herd.totalCattle > 0.3) {
      positiveSignals.push('Genç hayvan (düve) oranı yüksek, gelecek üretimi destekliyor.');
      herdStrengthScore = Math.min(100, herdStrengthScore + 10);
  }
  if (herdStrengthScore > 80) positiveSignals.push('Sağmal hayvan oranı ideal seviyede.');

  // 4. Debt Burden (15%)
  let debtBurdenScore: number | null = 100;
  if (currentInstallments === null || netCashFlow === null) {
    debtBurdenScore = null;
    warnings.push('Mevcut taksit veya gider bilgisi eksik olduğu için ödeme gücü hesaplanamadı.');
  } else if (netCashFlow > 0) {
    const paymentCapacity = currentInstallments > 0
      ? netCashFlow / currentInstallments
      : Number.POSITIVE_INFINITY;
    if (paymentCapacity < 1.2 && currentInstallments > 0) {
      warnings.push('Mevcut borç yükü net nakit akışının büyük kısmını tüketiyor.');
      debtBurdenScore = Math.max(0, paymentCapacity * 50);
    } else if (paymentCapacity >= 1.2 && paymentCapacity < 2) {
      debtBurdenScore = 75;
    } else {
      positiveSignals.push('Borç servis kapasitesi (ödeme gücü) yüksek.');
    }
  } else if (currentInstallments > 0) {
    debtBurdenScore = 0;
  }

  // 5. Income Regularity (15%)
  let incomeRegularityScore = 100;
  if (productionHistory.length < 6) {
    incomeRegularityScore -= (6 - productionHistory.length) * 15;
    warnings.push('Geçmiş üretim verilerinde eksik aylar var, gelir düzenliliği riskli.');
  }
  // Check if revenue covers costs consistently (we don't have monthly cost history, but we assume based on notes)
  if (riskNotes.some(note => note.toLowerCase().includes('düzensiz'))) {
    incomeRegularityScore -= 30;
    warnings.push('Gelir/Gider nakit akışında dönemsel düzensizlikler kaydedildi.');
  }
  incomeRegularityScore = Math.max(0, incomeRegularityScore);

  // 6. Operational Risk (15%)
  let operationalRiskScore = 100;
  if (riskNotes.some(note => note.toLowerCase().includes('mastitis') || note.toLowerCase().includes('salgın') || note.toLowerCase().includes('hastalık'))) {
    operationalRiskScore -= 40;
    warnings.push('Operasyonel sağlık/hastalık riskleri mevcut.');
  }
  if (riskNotes.some(note => note.toLowerCase().includes('dalgalanma') || note.toLowerCase().includes('yetersiz'))) {
    operationalRiskScore -= 20;
  }
  operationalRiskScore = Math.max(0, operationalRiskScore);
  if (operationalRiskScore > 80) positiveSignals.push('Operasyonel risk profili güvenli seviyede.');

  // Aggregate Score
  let overallScore = cashflowStrengthScore === null || debtBurdenScore === null
    ? null
    : (productionStabilityScore * 0.20)
      + (cashflowStrengthScore * 0.20)
      + (herdStrengthScore * 0.15)
      + (debtBurdenScore * 0.15)
      + (incomeRegularityScore * 0.15)
      + (operationalRiskScore * 0.15);

  if (reliabilityResult.score < 50) {
    warnings.push('Veri güvenilirliği çok düşük; sonuçlar eksikler tamamlanmadan doğrulanmış sayılmaz.');
  } else if (reliabilityResult.score < 80) {
    warnings.push('Eksik veriler mevcut; sonuçlar ek belge ve kayıtlarla doğrulanmalı.');
  }

  overallScore = overallScore === null ? null : Math.round(overallScore);

  // Determine Risk Level
  let riskLevel: RiskLevel | null = null;
  if (overallScore !== null) {
    riskLevel = 'Orta';
    if (overallScore >= 75) riskLevel = 'Düşük';
    else if (overallScore < 50) riskLevel = 'Yüksek';
  }

  const currentDscr = netCashFlow !== null
    && currentInstallments !== null
    && currentInstallments > 0
    ? netCashFlow / currentInstallments
    : null;

  const safeInstallmentMin = netCashFlow !== null
    && currentInstallments !== null
    ? Math.max(0, (netCashFlow / 1.5) - currentInstallments)
    : null;
  const safeInstallmentMax = netCashFlow !== null
    && currentInstallments !== null
    && safeInstallmentMin !== null
    ? Math.max(
        safeInstallmentMin,
        (netCashFlow / 1.25) - currentInstallments
      )
    : null;

  return {
    overallScore,
    riskLevel,
    methodologyVersion: 'rules-v2.0',
    assessmentStatus: overallScore === null ? 'Eksik Bilgi' : 'Hesaplanabilir',
    missingCriticalData: [
      ...(otherCosts === null ? ['Aylık diğer giderler'] : []),
      ...(currentInstallments === null ? ['Mevcut kredi taksitleri'] : []),
    ],
    operatingIncome: netCashFlow === null ? null : Math.round(netCashFlow),
    currentDscr,
    subScores: {
      productionStability: Math.round(productionStabilityScore),
      cashflowStrength: cashflowStrengthScore === null ? null : Math.round(cashflowStrengthScore),
      herdStrength: Math.round(herdStrengthScore),
      debtBurden: debtBurdenScore === null ? null : Math.round(debtBurdenScore),
      incomeRegularity: Math.round(incomeRegularityScore),
      operationalRisk: Math.round(operationalRiskScore),
    },
    positiveSignals,
    riskWarnings: warnings,
    reliabilityResult,
    safeInstallmentRange: {
      min: safeInstallmentMin === null ? null : Math.round(safeInstallmentMin),
      max: safeInstallmentMax === null ? null : Math.round(safeInstallmentMax),
    }
  };
};
