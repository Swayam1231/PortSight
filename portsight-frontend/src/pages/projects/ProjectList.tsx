import { useEffect, useState } from 'react';
import { Search, Filter, Plus, MoreVertical, X } from 'lucide-react';
import { projectAPI } from '../../api/api';
import StatusBadge from '../../components/common/StatusBadge';
import AddProjectForm from '../../components/AddProjectForm';
import { useNavigate } from 'react-router-dom';

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // <-- NEW: Holds the active filter
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false); // <-- NEW: Controls the dropdown menu
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectAPI.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectAdded = () => {
    setIsModalOpen(false);
    fetchProjects();
  };

  // --- THE NEW FILTERING ENGINE ---
  const filteredProjects = projects.filter(p => {
    // 1. Does it match the search bar?
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Does it match the dropdown filter?
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    
    // 3. Only show it if it matches BOTH!
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor all enterprise projects.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Toolbar (Search & Filter) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        
        {/* NEW: The Filter Dropdown System */}
        <div className="relative">
          <button 
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${statusFilter !== 'ALL' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            <Filter size={18} /> 
            {statusFilter === 'ALL' ? 'Filter Status' : statusFilter.replace('_', ' ')}
          </button>

          {/* The Popup Menu */}
          {isFilterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10 py-1">
              {['ALL', 'PROPOSED', 'ACTIVE', 'ON_HOLD', 'CANCELLED', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setIsFilterDropdownOpen(false); // Close menu after clicking
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {status === 'ALL' ? 'All Projects' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Project Name</th>
                <th className="p-4 font-semibold">Manager</th>
                <th className="p-4 font-semibold">Budget</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Strategic Value</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No projects found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr 
                    key={project.id} 
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{project.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{project.description}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {project.manager?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{project.manager?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-700">
                      ${project.allocatedBudget.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {project.expectedDurationDays} Days
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(project.strategicValueScore / 10) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-700">{project.strategicValueScore}/10</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* The Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="p-2">
              <AddProjectForm onProjectAdded={handleProjectAdded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}