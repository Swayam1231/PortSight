import { useEffect, useState } from 'react';
import { Briefcase, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { projectAPI } from '../../api/api';
import StatCard from '../../components/common/StatCard';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export default function PortfolioDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectAPI.getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  // --- INTELLIGENCE METRICS ---
  const totalBudget = projects.reduce((sum, p) => sum + p.allocatedBudget, 0);
  const activeCount = projects.filter(p => p.status !== 'COMPLETED' && p.status !== 'CANCELLED').length;
  const highRiskCount = projects.filter(p => p.strategicValueScore < 5).length;

  const budgetData = projects.map(p => ({
    name: p.name.substring(0, 10) + '...',
    budget: p.allocatedBudget
  }));

  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusData = Object.keys(statusCounts).map(key => ({
    name: key, value: statusCounts[key]
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time health and financial metrics across all active projects.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={projects.length} icon={<Briefcase size={24} className="text-blue-500" />} colorClass="border-blue-500" trend="+2" />
        <StatCard title="Total Budget" value={`$${(totalBudget / 1000000).toFixed(2)}M`} icon={<DollarSign size={24} className="text-emerald-500" />} colorClass="border-emerald-500" />
        <StatCard title="Active Projects" value={activeCount} icon={<Activity size={24} className="text-amber-500" />} colorClass="border-amber-500" />
        <StatCard title="High Risk" value={highRiskCount} icon={<AlertTriangle size={24} className="text-red-500" />} colorClass="border-red-500" trend="+1" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Budget Allocation</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="budget" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Portfolio Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}