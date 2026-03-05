import { useEffect, useState } from 'react';
import { projectAPI } from './api/api';
import AddProjectForm from './components/AddProjectForm';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, DollarSign, Activity, AlertTriangle } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']; // Green, Blue, Yellow, Red

export default function App() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectAPI.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- INTELLIGENCE ENGINE: Calculate Dashboard Metrics ---
  const totalBudget = projects.reduce((sum, p) => sum + p.allocatedBudget, 0);
  const activeProjects = projects.filter(p => p.status !== 'COMPLETED' && p.status !== 'CANCELLED');
  const highRiskProjects = projects.filter(p => p.strategicValueScore < 5); // Example risk logic

  // Data for Budget Chart
  const budgetData = projects.map(p => ({
    name: p.name.substring(0, 10) + '...', // Shorten name
    budget: p.allocatedBudget
  }));

  // Data for Status Pie Chart
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  if (loading) return <div className="p-10 text-xl font-bold text-gray-500">Loading Portfolio Intelligence...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Activity size={28} className="text-blue-400" />
          <h1 className="text-2xl font-bold tracking-wide">PortSight <span className="text-slate-400 font-normal">| Executive Command Center</span></h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8 mt-4">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Total Portfolio</p>
              <p className="text-3xl font-bold">{projects.length}</p>
            </div>
            <Briefcase size={36} className="text-blue-200" />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Total Budget</p>
              <p className="text-3xl font-bold">${(totalBudget / 1000000).toFixed(2)}M</p>
            </div>
            <DollarSign size={36} className="text-emerald-200" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-amber-500 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Active Projects</p>
              <p className="text-3xl font-bold">{activeProjects.length}</p>
            </div>
            <Activity size={36} className="text-amber-200" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">At Risk</p>
              <p className="text-3xl font-bold text-red-600">{highRiskProjects.length}</p>
            </div>
            <AlertTriangle size={36} className="text-red-200" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bar Chart: Budget Allocation */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Budget Allocation by Project</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData}>
                  <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="budget" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Project Status Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Portfolio Status Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Project Creation Area */}
        <AddProjectForm onProjectAdded={fetchProjects} />

      </div>
    </div>
  );
}