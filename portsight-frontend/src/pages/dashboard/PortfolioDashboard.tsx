import React, { useEffect, useState } from 'react';
import { BarChart3, Activity, AlertTriangle, DollarSign, Target, TrendingUp } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import StatCard from '../../components/common/StatCard';
import StatusCard from '../../components/common/StatusCard';
import AIInsights from '../../components/common/AIInsights';
import PortfolioHealthChart from '../../components/charts/PortfolioHealthChart';
import ValueRiskBubbleChart from '../../components/charts/ValueRiskBubbleChart';
import RiskHeatmap from '../../components/charts/RiskHeatmap';
import Loading from '../../components/common/Loading';
import type { PortfolioOverview, Risk } from '../../types';

const PortfolioDashboard: React.FC = () => {
  const [data, setData] = useState<PortfolioOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data matching Figma design
        const mockData: PortfolioOverview = {
          totalProjects: 6,
          greenCount: 3,
          yellowCount: 2,
          redCount: 1,
          averageHealth: 73,
          budgetAtRisk: 100000,
          projectsAtRisk: 1,
          healthDistribution: {
            green: 3,
            yellow: 2,
            red: 1,
          },
        };
        
        setTimeout(() => {
          setData(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Mock bubble chart data
  const bubbleData = [
    { name: 'P001', strategicPriority: 85, healthScore: 92, budget: 500000, status: 'healthy' as const },
    { name: 'P002', strategicPriority: 90, healthScore: 88, budget: 450000, status: 'healthy' as const },
    { name: 'P003', strategicPriority: 95, healthScore: 85, budget: 600000, status: 'healthy' as const },
    { name: 'P004', strategicPriority: 75, healthScore: 68, budget: 350000, status: 'at-risk' as const },
    { name: 'P005', strategicPriority: 80, healthScore: 72, budget: 400000, status: 'at-risk' as const },
    { name: 'P006', strategicPriority: 65, healthScore: 45, budget: 300000, status: 'critical' as const },
  ];

  // Mock risk data
  const mockRisks: Risk[] = [
    { id: '1', projectId: 'P001', title: 'Risk 1', description: '', severity: 'LOW', probability: 20, impact: 15, mitigationPlan: '', status: 'OPEN', createdAt: '' },
    { id: '2', projectId: 'P004', title: 'Risk 2', description: '', severity: 'LOW', probability: 15, impact: 20, mitigationPlan: '', status: 'OPEN', createdAt: '' },
    { id: '3', projectId: 'P006', title: 'Risk 3', description: '', severity: 'LOW', probability: 10, impact: 18, mitigationPlan: '', status: 'OPEN', createdAt: '' },
    { id: '4', projectId: 'P002', title: 'Risk 4', description: '', severity: 'MEDIUM', probability: 45, impact: 55, mitigationPlan: '', status: 'OPEN', createdAt: '' },
    { id: '5', projectId: 'P005', title: 'Risk 5', description: '', severity: 'MEDIUM', probability: 50, impact: 48, mitigationPlan: '', status: 'OPEN', createdAt: '' },
    { id: '6', projectId: 'P003', title: 'Risk 6', description: '', severity: 'HIGH', probability: 75, impact: 70, mitigationPlan: '', status: 'OPEN', createdAt: '' },
  ];

  if (isLoading) return <Loading text="Loading portfolio overview..." />;
  if (!data) return <div className="p-6 text-red-600">Error loading data</div>;

  const onTrackPercentage = Math.round((data.greenCount / data.totalProjects) * 100);
  const monitoringPercentage = Math.round((data.yellowCount / data.totalProjects) * 100);
  const criticalPercentage = Math.round((data.redCount / data.totalProjects) * 100);

  return (
    <PageContainer 
      title="Portfolio Dashboard"
      subtitle="Real-time insights and performance metrics across your project portfolio"
    >
      {/* Top Gradient Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Projects"
          value={data.totalProjects}
          subtitle="Active portfolio items"
          icon={BarChart3}
          variant="gradient"
          color="blue"
        />
        <StatCard
          title="Portfolio Health"
          value={`${data.averageHealth}%`}
          icon={Activity}
          variant="gradient"
          color="purple"
        />
        <StatCard
          title="High Risk Projects"
          value={data.projectsAtRisk}
          subtitle="Require immediate attention"
          icon={AlertTriangle}
          variant="gradient"
          color="red"
        />
        <StatCard
          title="Capital at Risk"
          value={`$${(data.budgetAtRisk / 1000000).toFixed(1)}M`}
          subtitle="From critical projects"
          icon={DollarSign}
          variant="gradient"
          color="purple"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Healthy Projects"
          value={data.greenCount}
          icon={Target}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="At Risk"
          value={data.yellowCount}
          icon={TrendingUp}
          color="yellow"
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          title="Critical Status"
          value={data.redCount}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Completion Rate"
          value="78%"
          icon={Target}
          color="purple"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Status Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusCard 
          status="ON_TRACK" 
          count={data.greenCount} 
          percentage={onTrackPercentage} 
        />
        <StatusCard 
          status="MONITORING" 
          count={data.yellowCount} 
          percentage={monitoringPercentage} 
        />
        <StatusCard 
          status="CRITICAL" 
          count={data.redCount} 
          percentage={criticalPercentage} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Portfolio Health Distribution
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Live Data
            </span>
          </div>
          <PortfolioHealthChart data={data.healthDistribution} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Value vs Risk Analysis
            </h3>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Strategic View
            </span>
          </div>
          <ValueRiskBubbleChart data={bubbleData} />
        </div>
      </div>

      {/* Risk Heat Map */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Risk Heat Map
          </h3>
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Risk Matrix
          </span>
        </div>
        <RiskHeatmap risks={mockRisks} />
      </div>

      {/* AI Insights */}
      <AIInsights 
        status="good"
        message="Portfolio performing well. 50% of projects are on track with healthy metrics. Continue monitoring the 2 at-risk projects to prevent escalation."
        onViewRecommendations={() => console.log('View recommendations clicked')}
      />
    </PageContainer>
  );
};

export default PortfolioDashboard;
