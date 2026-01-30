import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, DollarSign, Clock, Target, PlayCircle, FileText } from 'lucide-react';

import PageContainer from '../../components/layout/PageContainer';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import AIInsights from '../../components/common/AIInsights';
import Loading from '../../components/common/Loading';
import TrendChart from '../../components/charts/TrendChart';

import type { Project, Risk } from '../../types';
import { ProjectStatus, StrategicPriority } from '../../types';

interface ProjectDetailsData extends Project {
  risks: Risk[];
  trend: {
    date: string;
    healthScore: number;
    budgetVariance: number;
  }[];
  delayPercent: number;
  costOverrunPercent: number;
  riskScore: number;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        // ===== MOCK DATA (replace with API later) =====
        const mockProject: ProjectDetailsData = {
          id: id || 'P004',
          name: 'Security Enhancement',
          description: 'Upgrade security infrastructure across all systems',
          healthScore: 68,
          status: ProjectStatus.YELLOW,
          strategicPriority: StrategicPriority.CRITICAL,
          budget: 350000,
          budgetUsed: 280000,
          timeline: 120,
          timelineUsed: 100,
          delayDays: 15,
          costOverrun: 25000,
          recommendation: 'Increase resources and tighten scope control',
          createdAt: '2024-03-01',
          updatedAt: '2024-06-15',

          delayPercent: 12,
          costOverrunPercent: 7,
          riskScore: 42,

          trend: [
            { date: 'Jan', healthScore: 82, budgetVariance: 2 },
            { date: 'Feb', healthScore: 78, budgetVariance: 3 },
            { date: 'Mar', healthScore: 74, budgetVariance: 5 },
            { date: 'Apr', healthScore: 72, budgetVariance: 6 },
            { date: 'May', healthScore: 70, budgetVariance: 7 },
            { date: 'Jun', healthScore: 68, budgetVariance: 7 },
          ],

          risks: [
            { id: 'R1', projectId: 'P004', title: 'Vendor delay', description: '', severity: 'HIGH', probability: 70, impact: 60, mitigationPlan: '', status: 'OPEN', createdAt: '' },
            { id: 'R2', projectId: 'P004', title: 'Skill shortage', description: '', severity: 'MEDIUM', probability: 50, impact: 40, mitigationPlan: '', status: 'OPEN', createdAt: '' },
            { id: 'R3', projectId: 'P004', title: 'Scope creep', description: '', severity: 'MEDIUM', probability: 45, impact: 35, mitigationPlan: '', status: 'OPEN', createdAt: '' },
          ],
        };

        setTimeout(() => {
          setProject(mockProject);
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error('Failed to load project:', error);
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (isLoading) return <Loading text="Loading project details..." />;
  if (!project) return <div className="p-6 text-red-600">Project not found</div>;

  const budgetUsagePercent = Math.round((project.budgetUsed / project.budget) * 100);
  const timelineUsagePercent = Math.round((project.timelineUsed / project.timeline) * 100);

  const aiStatus =
    project.healthScore >= 80 ? 'excellent' :
    project.healthScore >= 65 ? 'good' :
    project.healthScore >= 50 ? 'warning' :
    'critical';

  return (
    <PageContainer
      title={project.name}
      subtitle={project.description}
      actions={
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={() => navigate(`/projects/${project.id}/simulate`)}
            className="btn-primary flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Run Simulation
          </button>
        </div>
      }
    >
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <StatusBadge status={project.status} size="lg" />
          </div>
          <p className="text-sm text-gray-600">Project ID: {project.id}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">System Recommendation</p>
          <p className="text-lg font-bold text-orange-600">{project.recommendation}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Health Score"
          value={`${project.healthScore}%`}
          icon={Target}
          color={project.healthScore >= 80 ? 'green' : project.healthScore >= 60 ? 'yellow' : 'red'}
        />
        <StatCard
          title="Delay"
          value={`${project.delayPercent}%`}
          icon={Clock}
          color={project.delayPercent > 10 ? 'red' : 'green'}
        />
        <StatCard
          title="Cost Overrun"
          value={`${project.costOverrunPercent}%`}
          icon={DollarSign}
          color={project.costOverrunPercent > 5 ? 'red' : 'green'}
        />
        <StatCard
          title="Risk Score"
          value={project.riskScore}
          icon={AlertTriangle}
          color={project.riskScore > 50 ? 'red' : project.riskScore > 30 ? 'yellow' : 'green'}
        />
        <StatCard
          title="Strategic Priority"
          value={project.strategicPriority}
          icon={Target}
          color="purple"
        />
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization</h3>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">${(project.budgetUsed / 1000).toFixed(0)}K used</span>
            <span className="font-semibold text-gray-900">${(project.budget / 1000).toFixed(0)}K</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${budgetUsagePercent > 90 ? 'bg-red-500' : budgetUsagePercent > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${budgetUsagePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{budgetUsagePercent}% of budget used</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Progress</h3>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">{project.timelineUsed} days used</span>
            <span className="font-semibold text-gray-900">{project.timeline} days</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${timelineUsagePercent > 90 ? 'bg-red-500' : timelineUsagePercent > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${timelineUsagePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{timelineUsagePercent}% of timeline used</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Trend
          </h3>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Last 6 Months
          </span>
        </div>
        <TrendChart data={project.trend} />
      </div>

      {/* Risks Summary */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Risks</h3>
        <div className="space-y-3">
          {project.risks.map((risk) => (
            <div key={risk.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{risk.title}</p>
                <p className="text-xs text-gray-500">
                  Probability: {risk.probability}% | Impact: {risk.impact}%
                </p>
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

      {/* AI Insights */}
      <AIInsights
        status={aiStatus}
        message={`Project health is currently ${project.healthScore}%. Trend shows a gradual decline over the last 3 months. Primary risks are vendor delays and skill shortage. System recommends immediate corrective action to avoid escalation.`}
        onViewRecommendations={() => navigate('/ranking')}
      />

      {/* Decision Actions */}
      <div className="mt-8 flex gap-4">
        <button className="btn-secondary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          View Decision History
        </button>
        <button className="btn-primary">
          Take Management Decision
        </button>
      </div>
    </PageContainer>
  );
};

export default ProjectDetails;
