import axios from 'axios';

// Create an Axios instance that points to our backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const projectAPI = {
  // Get all projects
  getAllProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },
  
  // Get a single project
  getProjectById: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  
  // Create a new project
  createProject: async (projectData: any) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },
  // Get all governance decisions
  getDecisionLog: async () => {
    const response = await apiClient.get('/projects/global/decisions');
    return response.data;
  },

  // Save a new decision
  logDecision: async (projectId: string, decisionData: any) => {
    const response = await apiClient.post(`/projects/${projectId}/decisions`, decisionData);
    return response.data;
  }
};