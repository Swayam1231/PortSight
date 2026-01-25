import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

interface AIInsightsProps {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  message: string;
  onViewRecommendations?: () => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
  status, 
  message,
  onViewRecommendations 
}) => {
  const statusConfig = {
    excellent: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
    },
    good: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-800',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-800',
    },
    critical: {
      bg: 'bg-gradient-to-r from-red-50 to-pink-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`${config.bg} ${config.border} border-2 rounded-xl p-6`}>
      <div className="flex items-start gap-4">
        <div className={`${config.icon} p-3 bg-white rounded-lg shadow-sm`}>
          <Sparkles className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${config.text} mb-2`}>
            AI-Powered Insights
          </h3>
          <p className={`text-sm ${config.text} leading-relaxed`}>
            {message}
          </p>
          
          {onViewRecommendations && (
            <button
              onClick={onViewRecommendations}
              className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
            >
              <TrendingUp className="w-4 h-4" />
              View Recommendations
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
