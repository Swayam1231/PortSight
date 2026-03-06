import { useEffect, useState } from 'react';
import { ShieldAlert, AlertOctagon, Info } from 'lucide-react';
import { projectAPI } from '../../api/api';
import RiskHeatmap from '../../components/charts/RiskHeatmap';

export default function RiskOverview() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We fetch all projects to extract their nested risks
        const projects = await projectAPI.getAllProjects();
        const allRisks = projects.flatMap((p: any) => 
          p.risks.map((r: any) => ({ ...r, projectName: p.name }))
        );
        setRisks(allRisks);
      } catch (error) {
        console.error("Failed to fetch risks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div></div>;

  const highRisks = risks.filter(r => (r.probability * r.impact) >= 15);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldAlert className="text-red-500" /> Portfolio Risk Radar
        </h1>
        <p className="text-gray-500 text-sm mt-1">Identify, assess, and mitigate threats across all active projects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-gray-800 mb-6 w-full text-left">Risk Matrix</h3>
          <RiskHeatmap risks={risks} />
          
          <div className="mt-8 w-full bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600 flex gap-3">
            <Info size={20} className="text-blue-500 flex-shrink-0" />
            <p>The numbers in the matrix represent the count of active risks falling into that specific probability and impact zone.</p>
          </div>
        </div>

        {/* Active Risks List Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">Critical Threats Register</h3>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
              {highRisks.length} High Risks
            </span>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            {risks.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <ShieldAlert size={48} className="mx-auto text-gray-300 mb-3" />
                <p>No active risks registered in the portfolio.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {risks.sort((a, b) => (b.probability * b.impact) - (a.probability * a.impact)).map((risk) => {
                  const score = risk.probability * risk.impact;
                  const isHigh = score >= 15;
                  
                  return (
                    <div key={risk.id} className={`p-4 rounded-lg border-l-4 shadow-sm flex justify-between items-center ${isHigh ? 'bg-red-50 border-red-500' : 'bg-white border-amber-400 border'}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          {isHigh && <AlertOctagon size={16} className="text-red-500" />}
                          <h4 className="font-bold text-gray-800">{risk.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Project: <span className="font-semibold text-gray-700">{risk.projectName}</span></p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold">SCORE</p>
                        <p className={`text-xl font-black ${isHigh ? 'text-red-600' : 'text-amber-600'}`}>
                          {score} <span className="text-sm font-normal text-gray-400">/ 25</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}