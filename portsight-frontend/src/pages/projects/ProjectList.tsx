import { useEffect, useState } from "react";
import { Search, Filter, Plus, MoreVertical, X } from "lucide-react";
import { projectAPI } from "../../api/api";
import StatusBadge from "../../components/common/StatusBadge";
import AddProjectForm from "../../components/AddProjectForm"; // <-- We import your form here!
import { useNavigate } from "react-router-dom";

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // NEW: State to control whether the popup is open or closed
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

  // NEW: What happens when the form successfully creates a project
  const handleProjectAdded = () => {
    setIsModalOpen(false); // Close the popup
    fetchProjects(); // Refresh the table with the new data
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Project Portfolio
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all enterprise projects.
          </p>
        </div>

        {/* NEW: We added the onClick event to the button! */}
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
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          <Filter size={18} /> Filter Status
        </button>
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
                <th className="p-4 font-semibold">Duration (Days)</th>
                <th className="p-4 font-semibold">Strategic Value</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No projects found matching your search.
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
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {project.description}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {project.manager?.name?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {project.manager?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-700">
                      ${project.allocatedBudget.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {project.expectedDurationDays}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{
                              width: `${(project.strategicValueScore / 10) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-700">
                          {project.strategicValueScore}/10
                        </span>
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

      {/* NEW: The Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            {/* Close Modal Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Render the Form inside the modal */}
            <div className="p-2">
              <AddProjectForm onProjectAdded={handleProjectAdded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
