import { useEffect, useState } from 'react';
import { History, CheckCircle, XCircle, AlertCircle, PlayCircle, RefreshCw } from 'lucide-react';
import { projectAPI } from '../../api/api';

export default function DecisionLog() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const data = await projectAPI.getDecisionLog();
        setDecisions(data);
      } catch (error) {
        console.error("Failed to fetch decision log", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDecisions();
  }, []);

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'CONTINUE': return <PlayCircle className="text-emerald-500" size={18} />;
      case 'STOP': return <XCircle className="text-red-500" size={18} />;
      case 'PAUSE': return <AlertCircle className="text-amber-500" size={18} />;
      case 'ACCELERATE': return <CheckCircle className="text-blue-500" size={18} />;
      case 'REPLAN': return <RefreshCw className="text-purple-500" size={18} />;
      default: return <History size={18} />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'CONTINUE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'STOP': return 'bg-red-100 text-red-800 border-red-200';
      case 'PAUSE': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ACCELERATE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REPLAN': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <History className="text-slate-700" /> Governance Audit Log
        </h1>
        <p className="text-gray-500 text-sm mt-1">Immutable record of all executive decisions and strategic pivots.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Project</th>
                <th className="p-4 font-semibold">Decision Type</th>
                <th className="p-4 font-semibold">Rationale / Notes</th>
                <th className="p-4 font-semibold">Authorized By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {decisions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No decisions logged yet. Use the Simulator to make a decision!</td>
                </tr>
              ) : (
                decisions.map((decision) => (
                  <tr key={decision.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-600">
                      {new Date(decision.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-gray-800">
                      {decision.project?.name || 'Unknown Project'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 flex items-center gap-1.5 rounded-full text-xs font-bold border w-max ${getBadgeStyle(decision.decisionType)}`}>
                        {getDecisionIcon(decision.decisionType)}
                        {decision.decisionType}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-md">
                      {decision.rationale}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-700">
                      {decision.decidedBy?.name || 'System'}
                      <p className="text-xs font-normal text-gray-400">{decision.decidedBy?.role}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}