export interface PersonalInfo {
  age: number;
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'retired';
  employmentDuration: number;
}

export interface FinancialInfo {
  monthlyIncome: number;
  monthlyExpenses: number;
  existingDebt: number;
  creditScore?: number;
}

export interface LoanDetails {
  requestedAmount: number;
  loanTerm: number;
  loanPurpose: string;
}

export interface EligibilityRequest {
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  loanDetails: LoanDetails;
}

export interface EligibilityResult {
  isEligible: boolean;
  approvalLikelihood: number;
  riskCategory: 'low' | 'medium' | 'high';
  decisionReason: string;
}

export interface RecommendedLoan {
  maxAmount: number;
  recommendedAmount: number;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
}

export interface AffordabilityAnalysis {
  disposableIncome: number;
  debtToIncomeRatio: number;
  loanToIncomeRatio: number;
  affordabilityScore: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface EligibilityResponse {
  eligibilityResult: EligibilityResult;
  recommendedLoan: RecommendedLoan;
  affordabilityAnalysis: AffordabilityAnalysis;
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRateRange: {
    min: number;
    max: number;
  };
  purposes: string[];
}

export interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface RateCalculationResponse {
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentSchedule: PaymentScheduleItem[];
}
