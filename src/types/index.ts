export type RiskLevel = 'Düşük' | 'Orta' | 'Yüksek';

export interface MilkProductionRecord {
  month: string;
  totalLiters: number;
  averagePerCow: number;
}

export interface HerdInfo {
  totalCattle: number;
  milkingCows: number;
  heifers: number;
  calves: number;
  dryCows: number;
}

export interface Financials {
  monthlyMilkRevenue: number;
  monthlyFeedCost: number;
  monthlyOtherCosts: number;
  currentLoanInstallments: number;
  requestedLoanAmount: number;
}

export interface DataSource {
  name: string;
  status: 'doğrulandı' | 'bekliyor' | 'eksik';
  date: string;
  impact: string;
  description: string;
}

export interface Producer {
  id: string;
  name: string;
  location: string;
  businessType: string;
  herd: HerdInfo;
  productionHistory: MilkProductionRecord[];
  financials: Financials;
  riskNotes: string[];
  dataSources: DataSource[];
  farmMemory: string;
  verificationNotes: string[];
}

export interface ReliabilityResult {
  score: number;
  missingData: string[];
  verificationNeeded: string[];
  warningMessage: string | null;
}

export interface ScoreResult {
  overallScore: number;
  riskLevel: RiskLevel;
  subScores: {
    productionStability: number;
    cashflowStrength: number;
    herdStrength: number;
    debtBurden: number;
    incomeRegularity: number;
    operationalRisk: number;
  };
  positiveSignals: string[];
  riskWarnings: string[];
  reliabilityResult: ReliabilityResult;
  safeInstallmentRange: { min: number; max: number };
}

export interface ForecastResult {
  predictions: { month: string; predictedLiters: number }[];
  confidenceLevel: number;
  trendExplanation: string;
  riskNote: string;
}

export interface AIReportResult {
  summary: string;
  positiveFactors: string[];
  negativeFactors: string[];
  architecturalNote: string;
}

export interface ScenarioResult {
  scenarioName: string;
  newMonthlyRevenue: number;
  newMonthlyExpenses: number;
  newNetCashFlow: number;
  newDscr: number;
  riskImpact: string;
  scoreImpact: number;
}

export type OpportunityType = 'Hibe' | 'Kredi' | 'Teşvik' | 'Faiz Desteği' | 'Ekipman Desteği' | 'Kooperatif Desteği';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  targetProducerType: string[];
  region: string[]; // 'Tümü' veya il isimleri
  requiredDocuments: string[];
  eligibilityRules: string;
  sourceNote: string; // "Senaryolaştırılmış örnek fırsattır. Resmi kurumlardan doğrulanmalıdır." vb.
}

export interface OpportunityMatch {
  opportunity: Opportunity;
  matchScore: number; // 0-100
  isHighlyEligible: boolean; // >= 75
  reasonForRecommendation: string;
  strongPoints: string[];
  missingRequirements: string[];
  verificationStatus: 'Eksik Belge' | 'Doğrulama Gerekli' | 'Ön Onaylı Gibi' | 'Değerlendirilebilir';
  riskNote: string;
}

