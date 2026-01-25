import React from 'react';
import { type LucideIcon } from 'lucide-react';


interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'gradient' | 'white';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  trend,
  variant = 'white',
  color = 'blue' 
}) => {
  const iconColorClasses = {
    blue: 'bg-blue-500/20 text-blue-100',
    green: 'bg-green-500/20 text-green-100',
    yellow: 'bg-yellow-500/20 text-yellow-100',
    red: 'bg-red-500/20 text-red-100',
    purple: 'bg-purple-500/20 text-purple-100',
  };

  const whiteIconColors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  if (variant === 'gradient') {
    return (
      <div className="gradient-card backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconColorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-white/80 mb-2">{title}</p>
          <p className="text-4xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-white/70 mt-2">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${whiteIconColors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      
      {trend && (
        <div className="flex items-center mt-2">
          <span className={`text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;



