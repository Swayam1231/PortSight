import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import type { Project } from '../../types';
import { ProjectStatus, StrategicPriority } from '../../types';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const mockProjects: Project[] = [
          {
            id: 'P001',
            name: 'Cloud Migration Initiative',
            description: 'Migrate legacy systems to cloud infrastructure',
            healthScore: 92,
            status: ProjectStatus.GREEN,
            strategicPriority: StrategicPriority.CRITICAL,
            budget: 500000,
            budgetUsed: 320000,
            timeline: 180,
            timelineUsed: 90,
            delayDays: 0,
            costOverrun: 0,
            recommendation: 'Continue as planned',
            createdAt: '2024-01-01',
            updatedAt: '2024-06-15',
          },
          {
            id: 'P002',
            name: 'Mobile App Development',
            description: 'Build customer-facing mobile application',
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
            createdAt: '2024-02-01',
            updatedAt: '2024-06-15',
          },
          {
            id: 'P003',
            name: 'Data Analytics Platform',
            description: 'Build comprehensive analytics solution',
            healthScore: 85,
            status: ProjectStatus.GREEN,
            strategicPriority: StrategicPriority.HIGH,
            budget: 600000,
            budgetUsed: 450000,
            timeline: 200,
            timelineUsed: 140,
            delayDays: 0,
            costOverrun: 0,
            recommendation: 'On track',
            createdAt: '2024-01-15',
            updatedAt: '2024-06-15',
          },
          {
            id: 'P004',
            name: 'Security Enhancement',
            description: 'Upgrade security infrastructure',
            healthScore: 68,
            status: ProjectStatus.YELLOW,
            strategicPriority: StrategicPriority.CRITICAL,
            budget: 350000,
            budgetUsed: 280000,
            timeline: 120,
            timelineUsed: 100,
            delayDays: 15,
            costOverrun: 25000,
            recommendation: 'Increase resources',
            createdAt: '2024-03-01',
            updatedAt: '2024-06-15',
          },
          {
            id: 'P005',
            name: 'Customer Portal Redesign',
            description: 'Modernize customer portal interface',
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
            createdAt: '2024-02-15',
            updatedAt: '2024-06-15',
          },
          {
            id: 'P006',
            name: 'Legacy System Decommission',
            description: 'Retire old mainframe systems',
            healthScore: 45,
            status: ProjectStatus.RED,
            strategicPriority: StrategicPriority.LOW,
            budget: 300000,
            budgetUsed: 280000,
            timeline: 100,
            timelineUsed: 95,
            delayDays: 30,
            costOverrun: 50000,
            recommendation: 'Critical review needed',
            createdAt: '2024-04-01',
            updatedAt: '2024-06-15',
          },
        ];

        setTimeout(() => {
          setProjects(mockProjects);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Loading text="Loading projects..." />;

  return (
    <PageContainer 
      title="Projects"
      subtitle={`${projects.length} active projects in portfolio`}
      actions={
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      }
    >
      {/* Search and Filter Bar */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                    Project ID
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Health Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr 
                  key={project.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div 
                          className={`h-2 rounded-full ${
                            project.healthScore >= 80 ? 'bg-green-500' :
                            project.healthScore >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${project.healthScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{project.healthScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.strategicPriority === StrategicPriority.CRITICAL ? 'bg-red-100 text-red-800' :
                      project.strategicPriority === StrategicPriority.HIGH ? 'bg-orange-100 text-orange-800' :
                      project.strategicPriority === StrategicPriority.MEDIUM ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.strategicPriority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">${(project.budgetUsed / 1000).toFixed(0)}K / ${(project.budget / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-500">{Math.round((project.budgetUsed / project.budget) * 100)}% used</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{project.timelineUsed} / {project.timeline} days</div>
                      <div className="text-xs text-gray-500">{Math.round((project.timelineUsed / project.timeline) * 100)}% complete</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.id}`);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProjectList;
