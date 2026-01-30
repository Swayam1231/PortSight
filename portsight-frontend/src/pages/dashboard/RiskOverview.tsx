import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import RiskHeatmap from '../../components/charts/RiskHeatmap';
import Loading from '../../components/common/Loading';
import type { Risk } from '../../types';

const RiskOverview: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockRisks: Risk[] = [
      { id: '1', projectId: 'P001', title: 'Vendor delay', description: '', severity: 'LOW', probability: 20, impact: 15, mitigationPlan: '', status: 'OPEN', createdAt: '' },
      { id: '2', projectId: 'P004', title: 'Security gap', description: '', severity: 'MEDIUM', probability: 45, impact: 50, mitigationPlan: '', status: 'OPEN', createdAt: '' },
      { id: '3', projectId: 'P006', title: 'System failure', description: '', severity: 'HIGH', probability: 70, impact: 80, mitigationPlan: '', status: 'OPEN', createdAt: '' },
      { id: '4', projectId: 'P003', title: 'Skill shortage', description: '', severity: 'MEDIUM', probability: 50, impact: 40, mitigationPlan: '', status: 'OPEN', createdAt: '' },
      { id: '5', projectId: 'P002', title: 'Scope creep', description: '', severity: 'LOW', probability: 30, impact: 25, mitigationPlan: '', status: 'OPEN', createdAt: '' },
    ];

    setTimeout(() => {
      setRisks(mockRisks);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) return <Loading text="Loading risk overview..." />;

  return (
    <PageContainer
      title="Risk Overview"
      subtitle="Portfolio-level risk exposure and heatmap"
    >
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Portfolio Risk Heatmap
        </h3>
        <RiskHeatmap risks={risks} />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Active Risks
        </h3>

        <div className="space-y-3">
          {risks.map((risk) => (
            <div key={risk.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{risk.title}</p>
                <p className="text-xs text-gray-500">Project: {risk.projectId}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                risk.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                risk.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default RiskOverview;
