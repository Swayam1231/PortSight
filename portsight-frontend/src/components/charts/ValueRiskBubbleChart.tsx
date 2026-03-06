import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProjectData {
  id: string;
  name: string;
  budget: number;
  value: number; // 1 to 10
  riskScore: number; // 0 to 25
}

export default function ValueRiskBubbleChart({ data }: { data: ProjectData[] }) {
  // Determine bubble color: High Value & Low Risk = Green. Low Value & High Risk = Red.
  const getBubbleColor = (value: number, risk: number) => {
    if (value >= 7 && risk <= 10) return '#10B981'; // Green (Optimal)
    if (value <= 4 && risk >= 15) return '#EF4444'; // Red (Kill Candidate)
    return '#3B82F6'; // Blue (Standard)
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 text-sm">
          <p className="font-bold text-gray-800 mb-2 border-b pb-1">{data.name}</p>
          <p className="text-gray-600">Strategic Value: <span className="font-bold text-gray-900">{data.value}/10</span></p>
          <p className="text-gray-600">Risk Exposure: <span className="font-bold text-gray-900">{data.riskScore}/25</span></p>
          <p className="text-gray-600">Budget: <span className="font-bold text-gray-900">${data.budget.toLocaleString()}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          type="number" 
          dataKey="riskScore" 
          name="Risk Exposure" 
          domain={[0, 25]} 
          label={{ value: 'Risk Exposure (Higher is Worse)', position: 'bottom', offset: 0, fontSize: 12, fill: '#6b7280' }} 
        />
        <YAxis 
          type="number" 
          dataKey="value" 
          name="Strategic Value" 
          domain={[0, 10]} 
          label={{ value: 'Strategic Value (Higher is Better)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#6b7280' }} 
        />
        <ZAxis 
          type="number" 
          dataKey="budget" 
          range={[100, 2000]} // This controls minimum and maximum bubble size
          name="Budget" 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Projects" data={data}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBubbleColor(entry.value, entry.riskScore)} opacity={0.8} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}