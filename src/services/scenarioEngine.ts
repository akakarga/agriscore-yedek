import type { Producer, ScenarioResult } from '../types';

export type ScenarioType = 
  | 'Mevcut Durum'
  | 'Yem Maliyeti %15 Artarsa'
  | 'Süt Fiyatı %10 Düşerse'
  | 'Üretim %10 Düşerse'
  | 'Yeni Kredi Taksiti Eklenirse';

export function calculateScenario(producer: Producer, scenario: ScenarioType): ScenarioResult {
  let newMonthlyRevenue = producer.financials.monthlyMilkRevenue;
  let newMonthlyExpenses = producer.financials.monthlyFeedCost + producer.financials.monthlyOtherCosts;
  let simulatedAdditionalInstallment = 0;
  
  if (scenario === 'Yem Maliyeti %15 Artarsa') {
    newMonthlyExpenses = (producer.financials.monthlyFeedCost * 1.15) + producer.financials.monthlyOtherCosts;
  } else if (scenario === 'Süt Fiyatı %10 Düşerse' || scenario === 'Üretim %10 Düşerse') {
    newMonthlyRevenue = producer.financials.monthlyMilkRevenue * 0.90;
  } else if (scenario === 'Yeni Kredi Taksiti Eklenirse') {
    // Simulate a 24-month loan for the requested amount with some interest (e.g., total 1.4x)
    simulatedAdditionalInstallment = (producer.financials.requestedLoanAmount * 1.4) / 24;
  }

  const operatingIncome = newMonthlyRevenue - newMonthlyExpenses;
  const totalDebtService = producer.financials.currentLoanInstallments + simulatedAdditionalInstallment;
  const newNetCashFlow = operatingIncome - totalDebtService;
  
  const newDscr = totalDebtService > 0 ? operatingIncome / totalDebtService : 999;

  let riskImpact = 'Değişim Yok';
  let scoreImpact = 0;

  if (newDscr < 1.0) {
    riskImpact = 'Kritik Risk (Nakit Akışı Negatif)';
    scoreImpact = -20;
  } else if (newDscr < 1.25) {
    riskImpact = 'Orta Risk (Borç Ödeme Zorluğu)';
    scoreImpact = -10;
  } else {
    riskImpact = 'Düşük Risk (Güvenli Alan)';
    scoreImpact = 0;
  }

  // Baseline comparison
  const baselineNetCashFlow = producer.financials.monthlyMilkRevenue - (producer.financials.monthlyFeedCost + producer.financials.monthlyOtherCosts) - producer.financials.currentLoanInstallments;
  if (newNetCashFlow < baselineNetCashFlow && newDscr >= 1.25) {
     riskImpact = 'Hafif Etki (Toleranslı)';
     scoreImpact = -2;
  }

  if (scenario === 'Mevcut Durum') {
    riskImpact = 'Baz Senaryo';
    scoreImpact = 0;
  }

  return {
    scenarioName: scenario,
    newMonthlyRevenue,
    newMonthlyExpenses,
    newNetCashFlow,
    newDscr,
    riskImpact,
    scoreImpact
  };
}
