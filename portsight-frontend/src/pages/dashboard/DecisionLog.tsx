import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle, PauseCircle, XCircle, RefreshCcw } from 'lucide-react';

import PageContainer from '../../components/layout/PageContainer';
import Loading from '../../components/common/Loading';

interface DecisionLogEntry {
  id: string;
  projectId: string;
  projectName: string;
  decision: 'CONTINUE' | 'PAUSE' | 'STOP' | 'REPLAN';
  reason: string;
  decidedBy: string;
  date: string;
}

const DecisionLog: React.FC = () => {
  const [decisions, setDecisions] = useState<DecisionLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDecisions = async () => {
      try {
        // ===== MOCK DATA =====
        const mockDecisions: DecisionLogEntry[] = [
          {
            id: 'D001',
            projectId: 'P006',
            projectName: 'Legacy System Decommission',
            decision: 'STOP',
            reason: 'Low strategic value and critical health score (45%).',
            decidedBy: 'Portfolio Board',
            date: '2024-06-10',
          },
          {
            id: 'D002',
            projectId: 'P004',
            projectName: 'Security Enhancement',
            decision: 'REPLAN',
            reason: 'High strategic priority but rising risk and declining health trend.',
            decidedBy: 'CTO Office',
            date: '2024-06-12',
          },
          {
            id: 'D003',
            projectId: 'P002',
            projectName: 'Mobile App Development',
            decision: 'PAUSE',
            reason: 'Budget overrun detected, waiting for revised cost baseline.',
            decidedBy: 'Finance Committee',
            date: '2024-06-14',
          },
          {
            id: 'D004',
            projectId: 'P001',
            projectName: 'Cloud Migration Initiative',
            decision: 'CONTINUE',
            reason: 'High strategic value and excellent health score (92%).',
            decidedBy: 'Executive Board',
            date: '2024-06-15',
          },
        ];

        setTimeout(() => {
          setDecisions(mockDecisions);
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error('Failed to load decision log:', error);
        setIsLoading(false);
      }
    };

    loadDecisions();
  }, []);

  const getDecisionBadge = (decision: DecisionLogEntry['decision']) => {
    switch (decision) {
      case 'CONTINUE':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4" />
            CONTINUE
          </span>
        );
      case 'PAUSE':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <PauseCircle className="w-4 h-4" />
            PAUSE
          </span>
        );
      case 'REPLAN':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <RefreshCcw className="w-4 h-4" />
            REPLAN
          </span>
        );
      case 'STOP':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-4 h-4" />
            STOP
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <Loading text="Loading decision audit log..." />;

  return (
    <PageContainer
      title="Decision Log & Governance Audit"
      subtitle="Complete history of portfolio-level management decisions"
      actions={
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="w-4 h-4" />
          {decisions.length} decisions recorded
        </div>
      }
    >
      {/* Decision Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Decision</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Authority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {decisions.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {new Date(d.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{d.projectName}</div>
                    <div className="text-xs text-gray-500">{d.projectId}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getDecisionBadge(d.decision)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                    {d.reason}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {d.decidedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Why this audit log is important
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          This governance log ensures accountability and transparency in portfolio management. Every strategic
          decision (continue, pause, replan, stop) is recorded along with justification and authority. This allows
          management to review past decisions, learn from outcomes, and demonstrate compliance and control.
        </p>
      </div>
    </PageContainer>
  );
};

export default DecisionLog;
