import { useEffect, useState } from 'react';
import { TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { projectAPI } from '../../api/api';
import ValueRiskBubbleChart from '../../components/charts/ValueRiskBubbleChart';

export default function ProjectRanking() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await projectAPI.getAllProjects();
        
        // Calculate total risk score for each project to feed the chart
        const processedData = data.map((p: any) => {
          const totalRiskScore = p.risks.reduce((sum: number, r: any) => sum + (r.probability * r.impact), 0);
          
          // AI Logic: Calculate an "Optimization Score" to rank them
          // Formula: (Value * 10) - Risk Score
          const optScore = (p.strategicValueScore * 10) - totalRiskScore;
          
          return { ...p, calculatedRiskScore: totalRiskScore, optimizationScore: optScore };
        });

        // Sort by best Optimization Score first
        processedData.sort((a: any, b: any) => b.optimizationScore - a.optimizationScore);
        
        setProjects(processedData);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const chartData = projects.map(p => ({
    id: p.id,
    name: p.name,
    budget: p.allocatedBudget,
    value: p.strategicValueScore,
    riskScore: p.calculatedRiskScore > 25 ? 25 : p.calculatedRiskScore // Cap at 25 for chart
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="text-blue-600" /> Portfolio Optimization Engine
        </h1>
        <p className="text-gray-500 text-sm mt-1">Algorithmically ranks projects based on Strategic Alignment vs. Risk Exposure.</p>
      </div>

      {/* Bubble Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Value vs. Risk Matrix</h3>
            <p className="text-xs text-gray-500 mt-1">Bubble size represents Project Budget. Top-Left is the optimal quadrant.</p>
          </div>
          <div className="flex gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-600"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Optimal</span>
            <span className="flex items-center gap-1 text-blue-600"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Standard</span>
            <span className="flex items-center gap-1 text-red-600"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Kill Candidate</span>
          </div>
        </div>
        
        <ValueRiskBubbleChart data={chartData} />
      </div>

      {/* Algorithmic Ranking Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">System Recommendations</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Project Name</th>
                <th className="p-4 font-semibold">Value / 10</th>
                <th className="p-4 font-semibold">Risk Exposure</th>
                <th className="p-4 font-semibold">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project, index) => {
                const isOptimal = project.optimizationScore >= 50;
                const isAtRisk = project.optimizationScore <= 20;

                return (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        #{index + 1}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-800">{project.name}</td>
                    <td className="p-4 font-semibold text-gray-700">{project.strategicValueScore}</td>
                    <td className="p-4 text-gray-600">{project.calculatedRiskScore}</td>
                    <td className="p-4">
                      {isOptimal ? (
                        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold w-max border border-emerald-200">
                          <Award size={14} /> Prioritize Funding
                        </span>
                      ) : isAtRisk ? (
                        <span className="flex items-center gap-1 text-red-700 bg-red-50 px-3 py-1 rounded-full text-xs font-bold w-max border border-red-200">
                          <AlertTriangle size={14} /> Consider Stopping
                        </span>
                      ) : (
                        <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold w-max border border-gray-200">
                          Maintain Course
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}