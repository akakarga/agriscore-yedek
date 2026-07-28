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
  monthlyOtherCosts: number | null;
  currentLoanInstallments: number | null;
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
  overallScore: number | null;
  riskLevel: RiskLevel | null;
  methodologyVersion: 'rules-v2.0';
  assessmentStatus: 'Hesaplanabilir' | 'Eksik Bilgi';
  missingCriticalData: string[];
  operatingIncome: number | null;
  currentDscr: number | null;
  subScores: {
    productionStability: number | null;
    cashflowStrength: number | null;
    herdStrength: number | null;
    debtBurden: number | null;
    incomeRegularity: number | null;
    operationalRisk: number | null;
  };
  positiveSignals: string[];
  riskWarnings: string[];
  reliabilityResult: ReliabilityResult;
  safeInstallmentRange: { min: number | null; max: number | null };
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
  newMonthlyRevenue: number | null;
  newMonthlyExpenses: number | null;
  newNetCashFlow: number | null;
  newDscr: number | null;
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
  eligibility: {
    minDscr?: number;
    minimumReliability?: number;
    minimumFeedRevenueRatio?: number;
    allowedRiskLevels?: RiskLevel[];
    excludedRiskTerms?: string[];
  };
  sourceNote: string; // "Senaryolaştırılmış örnek fırsattır. Resmi kurumlardan doğrulanmalıdır." vb.
}

export interface OpportunityMatch {
  opportunity: Opportunity;
  matchScore: number; // 0-100
  isHighlyEligible: boolean; // >= 75
  reasonForRecommendation: string;
  strongPoints: string[];
  missingRequirements: string[];
  verificationStatus: 'Eksik Belge' | 'Doğrulama Gerekli' | 'Yüksek Uyum - Resmi Doğrulama Gerekli' | 'Değerlendirilebilir';
  riskNote: string;
}
