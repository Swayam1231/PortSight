import React, { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';

import PageContainer from '../../components/layout/PageContainer';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';

import type { Project } from '../../types';
import { ProjectStatus, StrategicPriority } from '../../types';

interface RankedProject extends Project {
  rank: number;
  riskScore: number;
  valueScore: number;
}

const ProjectRanking: React.FC = () => {
  const [projects, setProjects] = useState<RankedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortKey, setSortKey] = useState<'rank' | 'health' | 'risk' | 'value'>('rank');

  useEffect(() => {
    const loadRanking = async () => {
      try {
        // ===== MOCK DATA =====
        const mockProjects: RankedProject[] = [
          {
            id: 'P001',
            name: 'Cloud Migration Initiative',
            description: '',
            healthScore: 92,
            status: ProjectStatus.GREEN,
            strategicPriority: StrategicPriority.CRITICAL,
            budget: 500000,
            budgetUsed: 320000,
            timeline: 180,
            timelineUsed: 90,
            delayDays: 0,
            costOverrun: 0,
            recommendation: 'Accelerate delivery',
            createdAt: '',
            updatedAt: '',
            rank: 1,
            riskScore: 18,
            valueScore: 95,
          },
          {
            id: 'P003',
            name: 'Data Analytics Platform',
            description: '',
            healthScore: 85,
            status: ProjectStatus.GREEN,
            strategicPriority: StrategicPriority.HIGH,
            budget: 600000,
            budgetUsed: 450000,
            timeline: 200,
            timelineUsed: 140,
            delayDays: 0,
            costOverrun: 0,
            recommendation: 'Continue as planned',
            createdAt: '',
            updatedAt: '',
            rank: 2,
            riskScore: 25,
            valueScore: 88,
          },
          {
            id: 'P002',
            name: 'Mobile App Development',
            description: '',
            healthScore: 88,
            status: ProjectStatus.GREEN,
            strategicPriority: StrategicPriority.HIGH,
            budget: 450000,
            budgetUsed: 380000,
            timeline: 150,
            timelineUsed: 120,
            delayDays: 5,
            costOverrun: 15000,
            recommendation: 'Monitor budget closely',
            createdAt: '',
            updatedAt: '',
            rank: 3,
            riskScore: 32,
            valueScore: 82,
          },
          {
            id: 'P005',
            name: 'Customer Portal Redesign',
            description: '',
            healthScore: 72,
            status: ProjectStatus.YELLOW,
            strategicPriority: StrategicPriority.MEDIUM,
            budget: 400000,
            budgetUsed: 350000,
            timeline: 160,
            timelineUsed: 135,
            delayDays: 10,
            costOverrun: 20000,
            recommendation: 'Monitor timeline',
            createdAt: '',
            updatedAt: '',
            rank: 4,
            riskScore: 45,
            valueScore: 70,
          },
          {
            id: 'P004',
            name: 'Security Enhancement',
            description: '',
            healthScore: 68,
            status: ProjectStatus.YELLOW,
            strategicPriority: StrategicPriority.CRITICAL,
            budget: 350000,
            budgetUsed: 280000,
            timeline: 120,
            timelineUsed: 100,
            delayDays: 15,
            costOverrun: 25000,
            recommendation: 'Replan with more resources',
            createdAt: '',
            updatedAt: '',
            rank: 5,
            riskScore: 58,
            valueScore: 78,
          },
          {
            id: 'P006',
            name: 'Legacy System Decommission',
            description: '',
            healthScore: 45,
            status: ProjectStatus.RED,
            strategicPriority: StrategicPriority.LOW,
            budget: 300000,
            budgetUsed: 280000,
            timeline: 100,
            timelineUsed: 95,
            delayDays: 30,
            costOverrun: 50000,
            recommendation: 'Consider stopping',
            createdAt: '',
            updatedAt: '',
            rank: 6,
            riskScore: 75,
            valueScore: 40,
          },
        ];

        setTimeout(() => {
          setProjects(mockProjects);
          setIsLoading(false);
        }, 700);
      } catch (error) {
        console.error('Failed to load ranking:', error);
        setIsLoading(false);
      }
    };

    loadRanking();
  }, []);

  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortKey) {
      case 'health':
        return b.healthScore - a.healthScore;
      case 'risk':
        return a.riskScore - b.riskScore;
      case 'value':
        return b.valueScore - a.valueScore;
      case 'rank':
      default:
        return a.rank - b.rank;
    }
  });

  if (isLoading) return <Loading text="Calculating portfolio ranking..." />;

  return (
    <PageContainer
      title="Project Ranking & Portfolio Optimization"
      subtitle="Projects ranked by strategic value, health, and risk exposure"
    >
      {/* Sort Controls */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button onClick={() => setSortKey('rank')} className={`btn-secondary ${sortKey === 'rank' ? 'ring-2 ring-blue-500' : ''}`}>Overall Rank</button>
          <button onClick={() => setSortKey('health')} className={`btn-secondary ${sortKey === 'health' ? 'ring-2 ring-blue-500' : ''}`}>Health</button>
          <button onClick={() => setSortKey('risk')} className={`btn-secondary ${sortKey === 'risk' ? 'ring-2 ring-blue-500' : ''}`}>Risk</button>
          <button onClick={() => setSortKey('value')} className={`btn-secondary ${sortKey === 'value' ? 'ring-2 ring-blue-500' : ''}`}>Strategic Value</button>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Health</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Strategic Value</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Recommendation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProjects.map((project, index) => (
                <tr key={project.id} className={`hover:bg-gray-50 ${index === 0 ? 'bg-yellow-50' : ''}`}>
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                    {project.rank}
                    {project.rank === 1 && <Crown className="w-4 h-4 text-yellow-500" />}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-xs text-gray-500">{project.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-4 font-semibold">{project.healthScore}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.riskScore > 60 ? 'bg-red-100 text-red-800' :
                      project.riskScore > 35 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {project.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">{project.valueScore}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {project.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-purple-900 mb-2">
          How ranking is computed
        </h4>
        <p className="text-sm text-purple-800 leading-relaxed">
          The portfolio ranking engine combines project health score, strategic value, and risk exposure into
          a composite score. Projects with high value, high health, and low risk are ranked higher and should
          receive priority funding and management attention.
        </p>
      </div>
    </PageContainer>
  );
};

export default ProjectRanking;
