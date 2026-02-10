interface TrustScoreProps {
  score: number;
}

export function TrustScore({ score }: TrustScoreProps) {
  // Determine trust level and colors
  const getTrustLevel = (score: number) => {
    if (score >= 80) return { label: 'Highly Trustworthy', color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-600' };
    if (score >= 60) return { label: 'Generally Trustworthy', color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-600' };
    if (score >= 40) return { label: 'Proceed with Caution', color: 'text-yellow-600', bg: 'bg-yellow-50', ring: 'ring-yellow-600' };
    return { label: 'Not Recommended', color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-600' };
  };

  const trustLevel = getTrustLevel(score);

  // Calculate stroke dasharray for circular progress
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Circular Progress */}
      <div className="relative w-40 h-40">
        <svg className="transform -rotate-90 w-40 h-40">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${trustLevel.color} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score Text */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className={`text-4xl font-bold ${trustLevel.color}`}>
            {score}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Trust Score</div>
        </div>
      </div>

      {/* Trust Level Badge */}
      <div className={`mt-4 px-4 py-2 rounded-full ${trustLevel.bg} ${trustLevel.color}`}>
        <span className="text-sm font-medium">{trustLevel.label}</span>
      </div>
    </div>
  );
}
