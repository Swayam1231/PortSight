import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PortfolioHealthChartProps {
  data: {
    green: number;
    yellow: number;
    red: number;
  };
}

const PortfolioHealthChart: React.FC<PortfolioHealthChartProps> = ({ data }) => {
  const total = data.green + data.yellow + data.red;
  
  const chartData = [
    { 
      name: 'Healthy', 
      value: data.green, 
      color: '#10b981',
      percentage: Math.round((data.green / total) * 100)
    },
    { 
      name: 'At Risk', 
      value: data.yellow, 
      color: '#f59e0b',
      percentage: Math.round((data.yellow / total) * 100)
    },
    { 
      name: 'Critical', 
      value: data.red, 
      color: '#ef4444',
      percentage: Math.round((data.red / total) * 100)
    },
  ];

  const CustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    outerRadius?: number;
    percent?: number;
    name?: string;
  }) => {
    if (!cx || !cy || !midAngle || !outerRadius || percent === undefined || !name) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#6b7280" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={CustomLabel}
          outerRadius={90}
          innerRadius={0}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number | undefined) => value !== undefined ? [`${value} projects`, ''] : ['', '']}
          contentStyle={{ 
            borderRadius: '8px', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          formatter={(value: string) => (
            <span className="text-sm text-gray-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PortfolioHealthChart;
