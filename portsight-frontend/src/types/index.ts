// Status Constants (replacing enum)
export const ProjectStatus = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  RED: 'RED',
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

// Strategic Priority Constants (replacing enum)
export const StrategicPriority = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export type StrategicPriority = typeof StrategicPriority[keyof typeof StrategicPriority];

// Core Types
export interface Project {
  id: string;
  name: string;
  description: string;
  healthScore: number;
  status: ProjectStatus;
  strategicPriority: StrategicPriority;
  budget: number;
  budgetUsed: number;
  timeline: number;
  timelineUsed: number;
  delayDays: number;
  costOverrun: number;
  recommendation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: number;
  impact: number;
  mitigationPlan: string;
  status: 'OPEN' | 'MITIGATED' | 'CLOSED';
  createdAt: string;
}

export interface PortfolioOverview {
  totalProjects: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  averageHealth: number;
  budgetAtRisk: number;
  projectsAtRisk: number;
  healthDistribution: {
    green: number;
    yellow: number;
    red: number;
  };
}

export interface ProjectRanking {
  projectId: string;
  projectName: string;
  healthScore: number;
  riskScore: number;
  strategicPriority: StrategicPriority;
  recommendation: string;
  rank: number;
}

export interface SimulationInput {
  budgetIncrease: number;
  timeIncrease: number;
  resourceIncrease: number;
}

export interface SimulationResult {
  currentHealth: number;
  simulatedHealth: number;
  improvement: number;
  feasibility: string;
  recommendation: string;
}

export interface DecisionLog {
  id: string;
  projectId: string;
  projectName: string;
  decision: string;
  rationale: string;
  impact: string;
  timestamp: string;
}

export interface HealthTrend {
  date: string;
  healthScore: number;
  budgetVariance: number;
  scheduleVariance: number;
}
