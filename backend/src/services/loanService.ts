import {
  EligibilityRequest,
  EligibilityResponse,
  RateCalculationResponse,
  PaymentScheduleItem
} from '../types/loan.types';

export class LoanService {
  calculateEligibility(request: EligibilityRequest): EligibilityResponse {
    const { personalInfo, financialInfo, loanDetails } = request;
    
    const disposableIncome = financialInfo.monthlyIncome - financialInfo.monthlyExpenses;
    const debtToIncomeRatio = ((financialInfo.existingDebt / financialInfo.monthlyIncome) * 100);
    const loanToIncomeRatio = ((loanDetails.requestedAmount / (financialInfo.monthlyIncome * 12)) * 100);
    
    const creditScore = financialInfo.creditScore || 650;
    const interestRate = this.calculateInterestRate(creditScore, loanDetails.loanTerm);
    const monthlyPayment = this.calculateMonthlyPayment(
      loanDetails.requestedAmount,
      interestRate,
      loanDetails.loanTerm
    );
    
    const isEligible = this.determineEligibility(
      disposableIncome,
      monthlyPayment,
      debtToIncomeRatio,
      personalInfo.employmentStatus,
      personalInfo.age
    );
    
    const approvalLikelihood = this.calculateApprovalLikelihood(
      creditScore,
      debtToIncomeRatio,
      disposableIncome,
      monthlyPayment,
      personalInfo.employmentStatus
    );
    
    const riskCategory = this.determineRiskCategory(creditScore, debtToIncomeRatio);
    const decisionReason = this.generateDecisionReason(
      isEligible,
      disposableIncome,
      debtToIncomeRatio,
      creditScore
    );
    
    const maxAmount = this.calculateMaxLoanAmount(
      financialInfo.monthlyIncome,
      financialInfo.monthlyExpenses,
      financialInfo.existingDebt,
      loanDetails.loanPurpose
    );
    
    const affordabilityScore = this.calculateAffordabilityScore(
      disposableIncome,
      monthlyPayment,
      debtToIncomeRatio
    );
    
    return {
      eligibilityResult: {
        isEligible,
        approvalLikelihood,
        riskCategory,
        decisionReason
      },
      recommendedLoan: {
        maxAmount,
        recommendedAmount: Math.min(loanDetails.requestedAmount, maxAmount),
        interestRate,
        monthlyPayment,
        totalRepayment: monthlyPayment * loanDetails.loanTerm
      },
      affordabilityAnalysis: {
        disposableIncome,
        debtToIncomeRatio: parseFloat(debtToIncomeRatio.toFixed(2)),
        loanToIncomeRatio: parseFloat(loanToIncomeRatio.toFixed(2)),
        affordabilityScore
      }
    };
  }

  calculateInterestRate(creditScore: number, loanTerm: number): number {
    let baseRate = 12.5;
    
    if (creditScore >= 750) {
      baseRate = 10.5;
    } else if (creditScore >= 700) {
      baseRate = 11.5;
    } else if (creditScore >= 650) {
      baseRate = 12.5;
    } else if (creditScore >= 600) {
      baseRate = 14.5;
    } else {
      baseRate = 16.5;
    }
    
    if (loanTerm > 36) {
      baseRate += 1.0;
    }
    
    return parseFloat(baseRate.toFixed(2));
  }

  calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
    return parseFloat(payment.toFixed(2));
  }

  calculatePaymentSchedule(
    principal: number,
    annualRate: number,
    months: number
  ): PaymentScheduleItem[] {
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, months);
    const schedule: PaymentScheduleItem[] = [];
    let balance = principal;

    for (let month = 1; month <= Math.min(months, 24); month++) {
      const interest = balance * monthlyRate;
      const principalPayment = monthlyPayment - interest;
      balance -= principalPayment;

      schedule.push({
        month,
        payment: parseFloat(monthlyPayment.toFixed(2)),
        principal: parseFloat(principalPayment.toFixed(2)),
        interest: parseFloat(interest.toFixed(2)),
        balance: parseFloat(Math.max(0, balance).toFixed(2))
      });
    }

    return schedule;
  }

  calculateRateAndSchedule(
    loanAmount: number,
    loanTerm: number,
    creditScore: number,
    loanType: string
  ): RateCalculationResponse {
    const interestRate = this.calculateInterestRate(creditScore, loanTerm);
    const monthlyPayment = this.calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    const totalRepayment = monthlyPayment * loanTerm;
    const totalInterest = totalRepayment - loanAmount;
    const paymentSchedule = this.calculatePaymentSchedule(loanAmount, interestRate, loanTerm);

    return {
      interestRate,
      monthlyPayment,
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      totalRepayment: parseFloat(totalRepayment.toFixed(2)),
      paymentSchedule
    };
  }

  private determineEligibility(
    disposableIncome: number,
    monthlyPayment: number,
    debtToIncomeRatio: number,
    employmentStatus: string,
    age: number
  ): boolean {
    if (employmentStatus === 'unemployed') return false;
    if (age < 18 || age > 65) return false;
    if (disposableIncome < monthlyPayment * 1.2) return false;
    if (debtToIncomeRatio > 40) return false;
    
    return true;
  }

  private calculateApprovalLikelihood(
    creditScore: number,
    debtToIncomeRatio: number,
    disposableIncome: number,
    monthlyPayment: number,
    employmentStatus: string
  ): number {
    let likelihood = 50;
    
    if (creditScore >= 750) likelihood += 20;
    else if (creditScore >= 700) likelihood += 15;
    else if (creditScore >= 650) likelihood += 10;
    else if (creditScore >= 600) likelihood += 5;
    else likelihood -= 10;
    
    if (debtToIncomeRatio < 20) likelihood += 15;
    else if (debtToIncomeRatio < 30) likelihood += 10;
    else if (debtToIncomeRatio < 40) likelihood += 5;
    else likelihood -= 15;
    
    const paymentToIncomeRatio = (monthlyPayment / disposableIncome) * 100;
    if (paymentToIncomeRatio < 30) likelihood += 10;
    else if (paymentToIncomeRatio < 40) likelihood += 5;
    else likelihood -= 10;
    
    if (employmentStatus === 'employed') likelihood += 10;
    else if (employmentStatus === 'self_employed') likelihood += 5;
    
    return Math.max(0, Math.min(100, likelihood));
  }

  private determineRiskCategory(
    creditScore: number,
    debtToIncomeRatio: number
  ): 'low' | 'medium' | 'high' {
    if (creditScore >= 700 && debtToIncomeRatio < 25) return 'low';
    if (creditScore >= 650 && debtToIncomeRatio < 35) return 'medium';
    return 'high';
  }

  private generateDecisionReason(
    isEligible: boolean,
    disposableIncome: number,
    debtToIncomeRatio: number,
    creditScore: number
  ): string {
    if (!isEligible) {
      if (disposableIncome < 0) {
        return 'Insufficient disposable income to support loan repayment';
      }
      if (debtToIncomeRatio > 40) {
        return 'Debt-to-income ratio exceeds acceptable threshold';
      }
      return 'Does not meet minimum eligibility criteria';
    }
    
    if (creditScore >= 700 && debtToIncomeRatio < 25) {
      return 'Excellent credit profile with strong income-to-expense ratio';
    }
    if (debtToIncomeRatio < 30) {
      return 'Strong income-to-expense ratio and manageable existing debt';
    }
    return 'Meets basic eligibility requirements with acceptable risk profile';
  }

  private calculateMaxLoanAmount(
    monthlyIncome: number,
    monthlyExpenses: number,
    existingDebt: number,
    loanPurpose: string
  ): number {
    const disposableIncome = monthlyIncome - monthlyExpenses;
    const maxMonthlyPayment = disposableIncome * 0.35;
    const maxLoanAmount = maxMonthlyPayment * 48;
    
    // Dynamic cap based on loan type
    const isVehicleLoan = loanPurpose.includes('vehicle');
    const productMaxAmount = isVehicleLoan ? 1500000 : 300000;
    
    return Math.round(Math.min(maxLoanAmount, productMaxAmount));
  }

  private calculateAffordabilityScore(
    disposableIncome: number,
    monthlyPayment: number,
    debtToIncomeRatio: number
  ): 'excellent' | 'good' | 'fair' | 'poor' {
    const paymentRatio = (monthlyPayment / disposableIncome) * 100;
    
    if (paymentRatio < 25 && debtToIncomeRatio < 20) return 'excellent';
    if (paymentRatio < 35 && debtToIncomeRatio < 30) return 'good';
    if (paymentRatio < 45 && debtToIncomeRatio < 40) return 'fair';
    return 'poor';
  }
}
