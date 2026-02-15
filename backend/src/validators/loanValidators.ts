import { z } from 'zod';

export const eligibilityRequestSchema = z.object({
  personalInfo: z.object({
    age: z.number().min(18).max(65),
    employmentStatus: z.enum(['employed', 'self_employed', 'unemployed', 'retired']),
    employmentDuration: z.number().min(3)
  }),
  financialInfo: z.object({
    monthlyIncome: z.number().min(5000),
    monthlyExpenses: z.number().min(0),
    existingDebt: z.number().min(0),
    creditScore: z.number().min(300).max(850).optional()
  }),
  loanDetails: z.object({
    requestedAmount: z.number().min(5000).max(1500000),  // Support both Personal (300k) and Vehicle (1.5M)
    loanTerm: z.number().min(6).max(72),                 // Support both Personal (60) and Vehicle (72)
    loanPurpose: z.string()
  })
});

export const rateCalculationSchema = z.object({
  loanAmount: z.number().min(5000).max(1500000),
  loanTerm: z.number().min(6).max(72),
  creditScore: z.number().min(300).max(850).optional(),
  loanType: z.string()
});
