import { CheckCircle, XCircle, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { EligibilityResponse } from '../types/loan.types';
import { formatCurrency, formatPercentage } from '../utils/validation';

interface ResultsDisplayProps {
  results: EligibilityResponse;
  onReset: () => void;
}

const ResultsDisplay = ({ results, onReset }: ResultsDisplayProps) => {
  const { eligibilityResult, recommendedLoan, affordabilityAnalysis } = results;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getAffordabilityColor = (score: string) => {
    switch (score) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Eligibility Results</h2>
        <button
          onClick={onReset}
          className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>

      <div
        className={`p-6 rounded-lg border-2 ${
          eligibilityResult.isEligible
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center mb-3">
          {eligibilityResult.isEligible ? (
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
          ) : (
            <XCircle className="w-8 h-8 text-red-600 mr-3" />
          )}
          <div>
            <h3 className="text-xl font-semibold">
              {eligibilityResult.isEligible ? 'Eligible for Loan' : 'Not Eligible'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">{eligibilityResult.decisionReason}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-slate-600">Approval Likelihood</p>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold">{eligibilityResult.approvalLikelihood}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${eligibilityResult.approvalLikelihood}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-600">Risk Category</p>
            <div
              className={`mt-2 px-3 py-2 rounded-lg border inline-flex items-center ${getRiskColor(
                eligibilityResult.riskCategory
              )}`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="font-semibold capitalize">{eligibilityResult.riskCategory}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
          Recommended Loan Details
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Maximum Amount</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {formatCurrency(recommendedLoan.maxAmount)}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Recommended Amount</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {formatCurrency(recommendedLoan.recommendedAmount)}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Interest Rate</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {formatPercentage(recommendedLoan.interestRate)}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Monthly Payment</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {formatCurrency(recommendedLoan.monthlyPayment)}
            </p>
          </div>

          <div className="p-4 bg-primary-50 rounded-lg col-span-2">
            <p className="text-sm text-primary-700">Total Repayment</p>
            <p className="text-2xl font-bold text-primary-900 mt-1">
              {formatCurrency(recommendedLoan.totalRepayment)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Affordability Analysis</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-700">Disposable Income</span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(affordabilityAnalysis.disposableIncome)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-700">Debt-to-Income Ratio</span>
            <span className="font-semibold text-slate-900">
              {formatPercentage(affordabilityAnalysis.debtToIncomeRatio)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-700">Loan-to-Income Ratio</span>
            <span className="font-semibold text-slate-900">
              {formatPercentage(affordabilityAnalysis.loanToIncomeRatio)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-700">Affordability Score</span>
            <span
              className={`font-semibold capitalize ${getAffordabilityColor(
                affordabilityAnalysis.affordabilityScore
              )}`}
            >
              {affordabilityAnalysis.affordabilityScore}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> These results are estimates based on the information provided. Final
          loan approval is subject to additional verification and credit checks.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
