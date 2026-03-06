import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Calendar, User, ShieldAlert, Activity } from 'lucide-react';
import { projectAPI } from '../../api/api';
import StatusBadge from '../../components/common/StatusBadge';
import ProjectSimulator from '../../components/intelligence/ProjectSimulator';

export default function ProjectDetails() {
  const { id } = useParams(); // Gets the ID from the URL
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await projectAPI.getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error("Failed to fetch project details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!project) return <div className="text-center p-10 text-xl font-bold text-gray-500">Project Not Found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <button onClick={() => navigate('/projects')} className="text-gray-500 hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
        <ArrowLeft size={20} /> Back to Portfolio
      </button>

      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-500 mt-1 max-w-2xl">{project.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={project.status} />
          <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Strategic Value: {project.strategicValueScore}/10
          </span>
        </div>
      </div>

      {/* Grid Layout for Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Core Metrics */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="text-blue-500" /> Execution Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-1"><Target size={14}/> Budget Allocated</p>
                <p className="text-2xl font-black text-gray-800">${project.allocatedBudget.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-1"><Calendar size={14}/> Timeline</p>
                <p className="text-2xl font-black text-gray-800">{project.expectedDurationDays} Days</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldAlert className="text-red-500" /> Active Risks ({project.risks.length})
            </h3>
            {project.risks.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No risks logged for this project.</p>
            ) : (
              <ul className="space-y-3">
                {project.risks.map((risk: any) => (
                  <li key={risk.id} className="p-3 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg text-sm">
                    <span className="font-bold text-gray-800">{risk.title}</span> 
                    <span className="text-amber-700 ml-2">(Score: {risk.probability * risk.impact})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Meta Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="text-emerald-500" /> Ownership
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                {project.manager?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-gray-800">{project.manager?.name || 'Unassigned'}</p>
                <p className="text-xs text-gray-500">{project.manager?.email || 'No email provided'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Grid Layout for Details ends right above here */}

      {/* THE NEW SIMULATION ENGINE */}
      <ProjectSimulator project={project} />

    </div>
  );
}
