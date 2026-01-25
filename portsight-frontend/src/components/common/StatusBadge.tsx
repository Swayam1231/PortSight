import React from 'react';
import { ProjectStatus } from '../../types';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const statusConfig = {
    [ProjectStatus.GREEN]: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'On Track',
    },
    [ProjectStatus.YELLOW]: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'At Risk',
    },
    [ProjectStatus.RED]: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Critical',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${config.bg} ${config.text} ${sizeClasses[size]}
    `}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${
        status === ProjectStatus.GREEN ? 'bg-green-500' :
        status === ProjectStatus.YELLOW ? 'bg-yellow-500' :
        'bg-red-500'
      }`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
