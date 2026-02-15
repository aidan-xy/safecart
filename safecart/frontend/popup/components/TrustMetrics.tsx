interface Metric {
  name: string;
  score: number;
}

interface TrustMetricsProps {
  metrics: Metric[];
}

export function TrustMetrics({ metrics }: TrustMetricsProps) {
  // gets status icon based on 
  const positiveScore = 75;
  const warningScore = 50;

  const getStatusIcon = (score: number) => {
    if (score >= positiveScore) {
      return (
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    }
    else if (score >= warningScore) {
      return (
        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      );
    }
    else {
      return (
        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
    }
  };

  const getStatusColor = (score: number) => {
    if (score >= positiveScore){
      return "text-green-600";
    } else if (score >= warningScore) {
      return "text-yellow-600";
    } else {
      return "text-red-600";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="font-semibold text-gray-900">
          Trust Metrics Breakdown
        </h3>
      </div>

      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
        >
          <div className="flex items-start gap-3">
            {getStatusIcon(metric.score)}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-medium text-gray-900 text-sm">
                  {metric.name}
                </h4>
                <span
                  className={`text-sm font-semibold ${getStatusColor(metric.score)}`}
                >
                  {metric.score}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-200 rounded-full mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    metric.score >= positiveScore
                      ? "bg-green-500"
                      : metric.score >= warningScore
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
              {/* <p className="text-xs text-gray-600 leading-relaxed">
                TEMPORARY DESCRIPTION
              </p> */}
            </div>
          </div>
        </div>
      ))}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <div className="flex gap-2">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-blue-900 leading-relaxed">
            Our algorithm evaluates price vs. market value, product ratings, 
            sales volume, review authenticity, and seller history to calculate 
            your trust score.
          </p>
        </div>
      </div>
    </div>
  );
}