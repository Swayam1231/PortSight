import axios from 'axios';

// Create an Axios instance that points to our backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define our API functions
export const projectAPI = {
  // Get all projects for the dashboard
  getAllProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },
  
  // Create a new project
  createProject: async (projectData: any) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  }
};

export default apiClient;