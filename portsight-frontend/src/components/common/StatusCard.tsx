import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

interface StatusCardProps {
  status: 'ON_TRACK' | 'MONITORING' | 'CRITICAL';
  count: number;
  percentage: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, count, percentage }) => {
  const configs = {
    ON_TRACK: {
      label: 'ON TRACK',
      icon: Check,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconBg: 'bg-green-500',
      progressBg: 'bg-green-500',
      borderColor: 'border-green-200',
    },
    MONITORING: {
      label: 'MONITORING',
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      iconBg: 'bg-yellow-500',
      progressBg: 'bg-yellow-500',
      borderColor: 'border-yellow-200',
    },
    CRITICAL: {
      label: 'CRITICAL',
      icon: X,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconBg: 'bg-red-500',
      progressBg: 'bg-red-500',
      borderColor: 'border-red-200',
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-6 flex flex-col items-center`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${config.iconBg}`} />
        <span className={`text-xs font-bold ${config.textColor} uppercase tracking-wide`}>
          {config.label}
        </span>
      </div>
      
      <div className={`${config.iconBg} rounded-2xl p-4 mb-4`}>
        <Icon className="w-8 h-8 text-white" strokeWidth={3} />
      </div>
      
      <p className={`text-4xl font-bold ${config.textColor} mb-2`}>{count}</p>
      <p className={`text-sm ${config.textColor} font-medium`}>
        {percentage}% of portfolio
      </p>
      
      <div className="w-full mt-4">
        <div className={`h-2 ${config.bgColor} rounded-full overflow-hidden border ${config.borderColor}`}>
          <div 
            className={`h-full ${config.progressBg}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
