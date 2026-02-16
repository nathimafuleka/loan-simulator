import { useState } from 'react';
import { Calculator } from 'lucide-react';
import LoanForm from './components/LoanForm';
import ResultsDisplay from './components/ResultsDisplay';
import { EligibilityResponse } from './types/loan.types';

function App() {
  const [results, setResults] = useState<EligibilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResults = (data: EligibilityResponse) => {
    setResults(data);
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900">
              Loan Eligibility Simulator
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Check your loan eligibility instantly with our advanced calculator. Get personalized
            recommendations based on your financial profile.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-slide-up">
            <LoanForm
              onResults={handleResults}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {results ? (
              <ResultsDisplay results={results} onReset={handleReset} />
            ) : (
              <div className="card h-full flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Fill out the form to see your eligibility results</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>© 2026 Loan Eligibility Simulator. All calculations are estimates only.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
