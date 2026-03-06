import { useState } from 'react';
import { projectAPI } from '../api/api';

export default function AddProjectForm({ onProjectAdded }: { onProjectAdded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    allocatedBudget: 0,
    expectedDurationDays: 0,
    teamSize: 5, // <-- NEW DEFAULT
    strategicValueScore: 5,
    managerId: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await projectAPI.createProject({
        ...formData,
        allocatedBudget: Number(formData.allocatedBudget),
        expectedDurationDays: Number(formData.expectedDurationDays),
        teamSize: Number(formData.teamSize), // <-- SEND TO BACKEND
        strategicValueScore: Number(formData.strategicValueScore),
        priorityLevel: 'HIGH'
      });
      alert('Project successfully created!');
      onProjectAdded(); 
    } catch (error) {
      console.error(error);
      alert('Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Project</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <input className="border p-2 rounded" placeholder="Project Name" required 
          onChange={e => setFormData({...formData, name: e.target.value})} />
          
        <input className="border p-2 rounded" placeholder="Description" required 
          onChange={e => setFormData({...formData, description: e.target.value})} />
          
        <input className="border p-2 rounded" type="number" placeholder="Budget ($)" required 
          onChange={e => setFormData({...formData, allocatedBudget: Number(e.target.value)})} />
          
        <input className="border p-2 rounded" type="number" placeholder="Duration (Days)" required 
          onChange={e => setFormData({...formData, expectedDurationDays: Number(e.target.value)})} />

        {/* NEW TEAM SIZE INPUT */}
        <input className="border p-2 rounded border-blue-400 bg-blue-50" type="number" placeholder="Total Team Members" min="1" required 
          onChange={e => setFormData({...formData, teamSize: Number(e.target.value)})} />
          
        <input className="border p-2 rounded" type="number" placeholder="Strategic Value (1-10)" min="1" max="10" required 
          onChange={e => setFormData({...formData, strategicValueScore: Number(e.target.value)})} />
          
        <input className="border p-2 rounded bg-gray-50" placeholder="Paste Manager ID Here" required 
          onChange={e => setFormData({...formData, managerId: e.target.value})} />

        <button type="submit" disabled={loading} className="col-span-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}