import { useState } from 'react';
import { User, Briefcase, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { loanApi } from '../utils/api';
import { validateForm } from '../utils/validation';
import { EligibilityRequest, EligibilityResponse, FormErrors } from '../types/loan.types';

interface LoanFormProps {
  onResults: (results: EligibilityResponse) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoanForm = ({ onResults, isLoading, setIsLoading }: LoanFormProps) => {
  const [formData, setFormData] = useState<EligibilityRequest>({
    personalInfo: {
      age: 35,
      employmentStatus: 'employed',
      employmentDuration: 24,
    },
    financialInfo: {
      monthlyIncome: 25000,
      monthlyExpenses: 15000,
      existingDebt: 5000,
      creditScore: 650,
    },
    loanDetails: {
      requestedAmount: 150000,
      loanTerm: 24,
      loanPurpose: 'home_improvement',
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string>('');

  const handleInputChange = (
    section: keyof EligibilityRequest,
    field: string,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await loanApi.checkEligibility(formData);
      onResults(result);
    } catch (error: any) {
      setApiError(
        error.response?.data?.error || 'Failed to check eligibility. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-text">Age</label>
            <input
              type="number"
              className="input-field"
              value={formData.personalInfo.age}
              onChange={(e) =>
                handleInputChange('personalInfo', 'age', parseInt(e.target.value) || 0)
              }
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="label-text">Employment Status</label>
            <select
              className="input-field"
              value={formData.personalInfo.employmentStatus}
              onChange={(e) => handleInputChange('personalInfo', 'employmentStatus', e.target.value)}
            >
              <option value="employed">Employed</option>
              <option value="self_employed">Self Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
            </select>
            {errors.employmentStatus && (
              <p className="text-red-500 text-sm mt-1">{errors.employmentStatus}</p>
            )}
          </div>

          <div>
            <label className="label-text">Employment Duration (months)</label>
            <input
              type="number"
              className="input-field"
              value={formData.personalInfo.employmentDuration}
              onChange={(e) =>
                handleInputChange('personalInfo', 'employmentDuration', parseInt(e.target.value) || 0)
              }
            />
            {errors.employmentDuration && (
              <p className="text-red-500 text-sm mt-1">{errors.employmentDuration}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <Briefcase className="w-5 h-5 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-slate-900">Financial Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-text">Monthly Income (R)</label>
            <input
              type="number"
              className="input-field"
              value={formData.financialInfo.monthlyIncome}
              onChange={(e) =>
                handleInputChange('financialInfo', 'monthlyIncome', parseFloat(e.target.value) || 0)
              }
            />
            {errors.monthlyIncome && (
              <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>
            )}
          </div>

          <div>
            <label className="label-text">Monthly Expenses (R)</label>
            <input
              type="number"
              className="input-field"
              value={formData.financialInfo.monthlyExpenses}
              onChange={(e) =>
                handleInputChange('financialInfo', 'monthlyExpenses', parseFloat(e.target.value) || 0)
              }
            />
            {errors.monthlyExpenses && (
              <p className="text-red-500 text-sm mt-1">{errors.monthlyExpenses}</p>
            )}
          </div>

          <div>
            <label className="label-text">Existing Debt (R)</label>
            <input
              type="number"
              className="input-field"
              value={formData.financialInfo.existingDebt}
              onChange={(e) =>
                handleInputChange('financialInfo', 'existingDebt', parseFloat(e.target.value) || 0)
              }
            />
            {errors.existingDebt && (
              <p className="text-red-500 text-sm mt-1">{errors.existingDebt}</p>
            )}
          </div>

          <div>
            <label className="label-text">Credit Score (Optional)</label>
            <input
              type="number"
              className="input-field"
              value={formData.financialInfo.creditScore || ''}
              onChange={(e) =>
                handleInputChange(
                  'financialInfo',
                  'creditScore',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="300-850"
            />
            {errors.creditScore && (
              <p className="text-red-500 text-sm mt-1">{errors.creditScore}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-slate-900">Loan Details</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-text">Loan Type</label>
            <select
              className="input-field"
              value={formData.loanDetails.loanPurpose.includes('vehicle') ? 'vehicle' : 'personal'}
              onChange={(e) => {
                const isVehicle = e.target.value === 'vehicle';
                handleInputChange('loanDetails', 'loanPurpose', isVehicle ? 'new_vehicle' : 'home_improvement');
              }}
            >
              <option value="personal">Personal Loan</option>
              <option value="vehicle">Vehicle Finance</option>
            </select>
          </div>

          <div>
            <label className="label-text">Requested Amount (R)</label>
            <input
              type="number"
              className="input-field"
              value={formData.loanDetails.requestedAmount}
              onChange={(e) =>
                handleInputChange('loanDetails', 'requestedAmount', parseFloat(e.target.value) || 0)
              }
            />
            {errors.requestedAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.requestedAmount}</p>
            )}
          </div>

          <div>
            <label className="label-text">Loan Term (months)</label>
            <input
              type="number"
              className="input-field"
              value={formData.loanDetails.loanTerm}
              onChange={(e) =>
                handleInputChange('loanDetails', 'loanTerm', parseInt(e.target.value) || 0)
              }
            />
            {errors.loanTerm && <p className="text-red-500 text-sm mt-1">{errors.loanTerm}</p>}
          </div>

          <div>
            <label className="label-text">Loan Purpose</label>
            <select
              className="input-field"
              value={formData.loanDetails.loanPurpose}
              onChange={(e) => handleInputChange('loanDetails', 'loanPurpose', e.target.value)}
            >
              {formData.loanDetails.loanPurpose.includes('vehicle') ? (
                <>
                  <option value="new_vehicle">New Vehicle</option>
                  <option value="used_vehicle">Used Vehicle</option>
                </>
              ) : (
                <>
                  <option value="debt_consolidation">Debt Consolidation</option>
                  <option value="home_improvement">Home Improvement</option>
                  <option value="education">Education</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </>
              )}
            </select>
            {errors.loanPurpose && (
              <p className="text-red-500 text-sm mt-1">{errors.loanPurpose}</p>
            )}
          </div>
        </div>
      </div>

      {apiError && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-red-700 text-sm">{apiError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <TrendingUp className="w-5 h-5 mr-2 animate-pulse" />
            Calculating...
          </>
        ) : (
          <>
            <TrendingUp className="w-5 h-5 mr-2" />
            Check Eligibility
          </>
        )}
      </button>
    </form>
  );
};

export default LoanForm;
