import axios, { type AxiosInstance } from 'axios';
import type {
  Project,
  Risk,
  PortfolioOverview,
  ProjectRanking,
  SimulationInput,
  SimulationResult,
  DecisionLog,
  HealthTrend
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(email: string, password: string) {
    // Mock login for demo purposes
    if (email === 'admin@portsight.com' && password === 'password123') {
      return {
        token: 'demo-token-12345',
        user: {
          id: '1',
          email: 'admin@portsight.com',
          name: 'Admin User'
        }
      };
    }
    
    // For other credentials, try the actual API (will fail if no backend)
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.api.post('/auth/register', { email, password, name });
    return response.data;
  }

  // Portfolio
  async getPortfolioOverview(): Promise<PortfolioOverview> {
    const response = await this.api.get('/portfolio/overview');
    return response.data;
  }

  async getProjectRanking(): Promise<ProjectRanking[]> {
    const response = await this.api.get('/portfolio/ranking');
    return response.data;
  }

  async getDecisionLogs(): Promise<DecisionLog[]> {
    const response = await this.api.get('/portfolio/decisions');
    return response.data;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await this.api.get('/projects');
    return response.data;
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await this.api.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const response = await this.api.post('/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await this.api.put(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.api.delete(`/projects/${id}`);
  }

  // Project Analytics
  async getProjectHealthTrend(id: string): Promise<HealthTrend[]> {
    const response = await this.api.get(`/projects/${id}/health-trend`);
    return response.data;
  }

  async simulateProject(id: string, input: SimulationInput): Promise<SimulationResult> {
    const response = await this.api.post(`/projects/${id}/simulate`, input);
    return response.data;
  }

  // Risks
  async getProjectRisks(projectId: string): Promise<Risk[]> {
    const response = await this.api.get(`/projects/${projectId}/risks`);
    return response.data;
  }

  async createRisk(projectId: string, data: Partial<Risk>): Promise<Risk> {
    const response = await this.api.post(`/projects/${projectId}/risks`, data);
    return response.data;
  }

  async updateRisk(projectId: string, riskId: string, data: Partial<Risk>): Promise<Risk> {
    const response = await this.api.put(`/projects/${projectId}/risks/${riskId}`, data);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
