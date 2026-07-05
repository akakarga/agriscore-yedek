import type { Producer, ScoreResult, RiskLevel } from '../types';
import { calculateReliability } from './reliabilityEngine';

export const calculateAgriScore = (producer: Producer): ScoreResult => {
  const { productionHistory, financials, herd, riskNotes } = producer;

  const warnings: string[] = [];
  const positiveSignals: string[] = [];

  // Calculate Reliability
  const reliabilityResult = calculateReliability(producer);

  // 1. Production Stability (25%)
  let productionStabilityScore = 0;
  if (productionHistory.length > 1) {
    const changes: number[] = [];
    for (let i = 1; i < productionHistory.length; i++) {
      const prev = productionHistory[i - 1].totalLiters;
      const curr = productionHistory[i].totalLiters;
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

  // 2. Cashflow Strength (25%)
  const totalRevenue = financials.monthlyMilkRevenue;
  const totalCosts = financials.monthlyFeedCost + financials.monthlyOtherCosts;
  const netCashFlow = totalRevenue - totalCosts;
  
  let cashflowStrengthScore = 0;
  if (netCashFlow > 0) {
    const margin = netCashFlow / totalRevenue;
    cashflowStrengthScore = Math.min(100, margin * 300); // 33% margin = 100 score
    if (cashflowStrengthScore > 80) positiveSignals.push('Nakit akışı güçlü ve sürdürülebilir.');
  } else {
    warnings.push('Negatif nakit akışı: Aylık giderler gelirleri aşıyor.');
  }

  // 3. Herd Strength (20%)
  const milkingRatio = herd.totalCattle > 0 ? herd.milkingCows / herd.totalCattle : 0;
  let herdStrengthScore = Math.min(100, milkingRatio * 150); // 66% milking ratio = 100 score
  
  if (herd.heifers / herd.totalCattle > 0.3) {
      positiveSignals.push('Genç hayvan (düve) oranı yüksek, gelecek üretimi destekliyor.');
      herdStrengthScore = Math.min(100, herdStrengthScore + 10);
  }
  if (herdStrengthScore > 80) positiveSignals.push('Sağmal hayvan oranı ideal seviyede.');

  // 4. Debt Burden (15%)
  let debtBurdenScore = 100;
  if (netCashFlow > 0) {
    const dscr = netCashFlow / (financials.currentLoanInstallments || 1); // Debt Service Coverage Ratio
    if (dscr < 1.2 && financials.currentLoanInstallments > 0) {
      warnings.push('Mevcut borç yükü net nakit akışının büyük kısmını tüketiyor.');
      debtBurdenScore = Math.max(0, dscr * 50);
    } else if (dscr >= 1.2 && dscr < 2) {
      debtBurdenScore = 75;
    } else {
      positiveSignals.push('Borç servis kapasitesi (ödeme gücü) yüksek.');
    }
  } else if (financials.currentLoanInstallments > 0) {
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

  // 6. Operational Risk (15%)
  let operationalRiskScore = 100;
  if (riskNotes.some(note => note.toLowerCase().includes('mastitis') || note.toLowerCase().includes('salgın') || note.toLowerCase().includes('hastalık'))) {
    operationalRiskScore -= 40;
    warnings.push('Operasyonel sağlık/hastalık riskleri mevcut.');
  }
  if (riskNotes.some(note => note.toLowerCase().includes('dalgalanma') || note.toLowerCase().includes('yetersiz'))) {
    operationalRiskScore -= 20;
  }
  if (operationalRiskScore > 80) positiveSignals.push('Operasyonel risk profili güvenli seviyede.');

  // Aggregate Score
  let overallScore = 
    (productionStabilityScore * 0.20) + 
    (cashflowStrengthScore * 0.20) + 
    (herdStrengthScore * 0.15) + 
    (debtBurdenScore * 0.15) + 
    (incomeRegularityScore * 0.15) +
    (operationalRiskScore * 0.15);

  // Apply data reliability penalty
  if (reliabilityResult.score < 50) {
    overallScore = overallScore * 0.6; // 40% penalty for critically poor data quality
    warnings.push('Veri güvenilirliği çok düşük olduğu için Risk Skoru baskılandı.');
  } else if (reliabilityResult.score < 80) {
    overallScore = overallScore * 0.9; // 10% penalty for incomplete data
    warnings.push('Eksik veriler nedeniyle Risk Skoru ihtiyatlı hesaplandı.');
  }

  overallScore = Math.round(overallScore);

  // Determine Risk Level
  let riskLevel: RiskLevel = 'Orta';
  if (overallScore >= 75) riskLevel = 'Düşük';
  else if (overallScore < 50) riskLevel = 'Yüksek';

  // Capacity calculation
  const safeInstallmentMax = netCashFlow > 0 ? netCashFlow * 0.6 : 0; // Can safely use 60% of net cashflow for new loans
  const safeInstallmentMin = netCashFlow > 0 ? netCashFlow * 0.3 : 0;

  return {
    overallScore,
    riskLevel,
    subScores: {
      productionStability: Math.round(productionStabilityScore),
      cashflowStrength: Math.round(cashflowStrengthScore),
      herdStrength: Math.round(herdStrengthScore),
      debtBurden: Math.round(debtBurdenScore),
      incomeRegularity: Math.max(0, Math.round(incomeRegularityScore)),
      operationalRisk: Math.max(0, Math.round(operationalRiskScore)),
    },
    positiveSignals,
    riskWarnings: warnings,
    reliabilityResult,
    safeInstallmentRange: { min: Math.round(safeInstallmentMin), max: Math.round(safeInstallmentMax) }
  };
};
