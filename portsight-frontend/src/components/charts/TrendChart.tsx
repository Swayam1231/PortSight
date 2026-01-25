import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

interface TrendChartProps {
  data: {
    date: string;
    healthScore: number;
    budgetVariance: number;
  }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="healthScore" 
          stroke="#0ea5e9" 
          strokeWidth={2}
          name="Health Score"
          dot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="budgetVariance" 
          stroke="#f59e0b" 
          strokeWidth={2}
          name="Budget Variance %"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
