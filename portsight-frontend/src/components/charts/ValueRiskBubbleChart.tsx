import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';

interface BubbleDataPoint {
  name: string;
  strategicPriority: number;
  healthScore: number;
  budget: number;
  status: 'healthy' | 'at-risk' | 'critical';
}

interface ValueRiskBubbleChartProps {
  data: BubbleDataPoint[];
}

const ValueRiskBubbleChart: React.FC<ValueRiskBubbleChartProps> = ({ data }) => {
  const getColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'at-risk': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          type="number" 
          dataKey="strategicPriority" 
          name="Strategic Priority"
          domain={[0, 100]}
          label={{ value: 'Strategic Priority →', position: 'bottom', offset: 0, style: { fill: '#6b7280', fontSize: 12 } }}
          tick={{ fontSize: 11, fill: '#6b7280' }}
        />
        <YAxis 
          type="number" 
          dataKey="healthScore" 
          name="Health Score"
          domain={[0, 100]}
          label={{ value: '← Health Score', angle: 0, position: 'left', offset: 10, style: { fill: '#6b7280', fontSize: 12 } }}
          tick={{ fontSize: 11, fill: '#6b7280' }}
        />
        <ZAxis 
          type="number" 
          dataKey="budget" 
          range={[100, 1000]} 
          name="Budget"
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                  <p className="font-semibold text-gray-900">{data.name}</p>
                  <p className="text-sm text-gray-600">Health: {data.healthScore}%</p>
                  <p className="text-sm text-gray-600">Priority: {data.strategicPriority}</p>
                  <p className="text-sm text-gray-600">Budget: ${(data.budget / 1000).toFixed(0)}K</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter name="Projects" data={data}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ValueRiskBubbleChart;
