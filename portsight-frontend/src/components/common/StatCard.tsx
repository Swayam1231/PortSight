import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorClass: string;
  trend?: string;
}

export default function StatCard({ title, value, icon, colorClass, trend }: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${colorClass} flex flex-col justify-between hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{title}</p>
        <div className="p-2 rounded-lg bg-gray-50">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {trend && (
          <p className="text-xs font-medium mt-2 text-gray-500">
            {trend.startsWith('+') ? <span className="text-green-500">{trend}</span> : <span className="text-red-500">{trend}</span>} from last month
          </p>
        )}
      </div>
    </div>
  );
}