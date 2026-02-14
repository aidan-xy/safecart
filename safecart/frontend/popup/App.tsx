import { useState } from 'react';
import { TrustScore } from './components/TrustScore';
import { TrustMetrics } from './components/TrustMetrics';

// Mock data for the listing being analyzed
const mockTrustData = {
  score: 78,
  metrics: [
    {
      name: 'Product Rating',
      score: 92,
      status: 'positive' as const,
      description: 'Strong 4.6/5 average rating with high customer satisfaction'
    },
    {
      name: 'Price Analysis',
      score: 65,
      status: 'warning' as const,
      description: 'Listing price is 15% below market average - review carefully'
    },
    {
      name: 'Sales Volume',
      score: 88,
      status: 'positive' as const,
      description: 'Over 3,400 units sold indicating established product'
    },
    {
      name: 'Review Authenticity',
      score: 85,
      status: 'positive' as const,
      description: '1,250 verified ratings with 420+ review images uploaded'
    },
    {
      name: 'Seller Age',
      score: 72,
      status: 'positive' as const,
      description: 'Seller account active for 2.3 years with consistent history'
    }
  ]
};

export default function App(trustData: {
    score: number;
    metrics: {name: string;
      score: number;}[]
    }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-[380px] bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="w-5 h-5 text-blue-600"
              strokeWidth="2.5"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-white font-semibold text-lg">SafeCart</h1>
        </div>
      </div>

      {/* Trust Score Display */}
      <div className="p-5">
        <TrustScore score={trustData.score} />
        
        {/* Action Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>{showDetails ? 'Hide Details' : 'View Trust Metrics'}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Detailed Metrics */}
        {showDetails && (
          <div className="mt-4 animate-fadeIn">
            <TrustMetrics metrics={trustData.metrics} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-5 py-3 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          SafeCart analyzes multiple factors to assess listing trustworthiness
        </p>
      </div>
    </div>
  );
}