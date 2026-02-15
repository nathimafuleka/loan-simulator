import { Router, Request, Response } from 'express';
import { LoanService } from '../services/loanService';
import { eligibilityRequestSchema, rateCalculationSchema } from '../validators/loanValidators';

const router = Router();
const loanService = new LoanService();

router.post('/eligibility', async (req: Request, res: Response) => {
  try {
    const validatedData = eligibilityRequestSchema.parse(req.body);
    const result = loanService.calculateEligibility(validatedData);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products', (req: Request, res: Response) => {
  const products = [
    {
      id: 'personal_loan',
      name: 'Personal Loan',
      description: 'Flexible personal financing for various needs',
      minAmount: 5000.0,
      maxAmount: 300000.0,
      minTerm: 6,
      maxTerm: 60,
      interestRateRange: {
        min: 10.5,
        max: 18.5
      },
      purposes: ['debt_consolidation', 'home_improvement', 'education', 'medical', 'other']
    },
    {
      id: 'vehicle_loan',
      name: 'Vehicle Finance',
      description: 'Financing for new and used vehicles',
      minAmount: 50000.0,
      maxAmount: 1500000.0,
      minTerm: 12,
      maxTerm: 72,
      interestRateRange: {
        min: 8.5,
        max: 15.0
      },
      purposes: ['new_vehicle', 'used_vehicle']
    }
  ];

  res.json({ products });
});

router.post('/calculate-rate', async (req: Request, res: Response) => {
  try {
    const validatedData = rateCalculationSchema.parse(req.body);
    const result = loanService.calculateRateAndSchedule(
      validatedData.loanAmount,
      validatedData.loanTerm,
      validatedData.creditScore || 650,
      validatedData.loanType
    );
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/validation-rules', (req: Request, res: Response) => {
  const rules = {
    personalInfo: {
      age: {
        min: 18,
        max: 65,
        required: true,
        errorMessage: 'Age must be between 18 and 65'
      },
      employmentStatus: {
        required: true,
        options: ['employed', 'self_employed', 'unemployed', 'retired'],
        errorMessage: 'Please select your employment status'
      },
      employmentDuration: {
        min: 3,
        required: true,
        errorMessage: 'Minimum 3 months employment required'
      }
    },
    financialInfo: {
      monthlyIncome: {
        min: 5000.0,
        required: true,
        errorMessage: 'Minimum monthly income of R5,000 required'
      },
      monthlyExpenses: {
        min: 0,
        required: true,
        errorMessage: 'Please enter your monthly expenses'
      },
      creditScore: {
        min: 300,
        max: 850,
        required: false,
        errorMessage: 'Credit score must be between 300 and 850'
      }
    },
    loanDetails: {
      requestedAmount: {
        min: 5000.0,
        max: 300000.0,
        required: true,
        errorMessage: 'Loan amount must be between R5,000 and R300,000'
      },
      loanTerm: {
        min: 6,
        max: 60,
        required: true,
        errorMessage: 'Loan term must be between 6 and 60 months'
      }
    }
  };

  res.json(rules);
});

export default router;
