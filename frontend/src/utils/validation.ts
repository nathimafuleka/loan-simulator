import { EligibilityRequest, FormErrors } from '../types/loan.types';

export const validateForm = (data: EligibilityRequest): FormErrors => {
  const errors: FormErrors = {};

  if (data.personalInfo.age < 18 || data.personalInfo.age > 65) {
    errors.age = 'Age must be between 18 and 65';
  }

  if (!data.personalInfo.employmentStatus) {
    errors.employmentStatus = 'Please select your employment status';
  }

  if (data.personalInfo.employmentDuration < 3) {
    errors.employmentDuration = 'Minimum 3 months employment required';
  }

  if (data.financialInfo.monthlyIncome < 5000) {
    errors.monthlyIncome = 'Minimum monthly income of R5,000 required';
  }

  if (data.financialInfo.monthlyExpenses < 0) {
    errors.monthlyExpenses = 'Monthly expenses cannot be negative';
  }

  if (data.financialInfo.existingDebt < 0) {
    errors.existingDebt = 'Existing debt cannot be negative';
  }

  if (
    data.financialInfo.creditScore !== undefined &&
    (data.financialInfo.creditScore < 300 || data.financialInfo.creditScore > 850)
  ) {
    errors.creditScore = 'Credit score must be between 300 and 850';
  }

  // Dynamic validation based on loan type
  const isVehicleLoan = data.loanDetails.loanPurpose.includes('vehicle');
  
  if (isVehicleLoan) {
    // Vehicle Finance: R50,000 - R1,500,000
    if (data.loanDetails.requestedAmount < 50000 || data.loanDetails.requestedAmount > 1500000) {
      errors.requestedAmount = 'Vehicle loan amount must be between R50,000 and R1,500,000';
    }
    // Vehicle Finance: 12-72 months
    if (data.loanDetails.loanTerm < 12 || data.loanDetails.loanTerm > 72) {
      errors.loanTerm = 'Vehicle loan term must be between 12 and 72 months';
    }
  } else {
    // Personal Loan: R5,000 - R300,000
    if (data.loanDetails.requestedAmount < 5000 || data.loanDetails.requestedAmount > 300000) {
      errors.requestedAmount = 'Personal loan amount must be between R5,000 and R300,000';
    }
    // Personal Loan: 6-60 months
    if (data.loanDetails.loanTerm < 6 || data.loanDetails.loanTerm > 60) {
      errors.loanTerm = 'Personal loan term must be between 6 and 60 months';
    }
  }

  if (!data.loanDetails.loanPurpose) {
    errors.loanPurpose = 'Please select a loan purpose';
  }

  return errors;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
