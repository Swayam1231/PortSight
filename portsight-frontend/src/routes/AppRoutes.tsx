import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';

// Pages
import PortfolioDashboard from '../pages/dashboard/PortfolioDashboard';
import ProjectRanking from '../pages/dashboard/ProjectRanking';
import DecisionLog from '../pages/dashboard/DecisionLog';

import ProjectList from '../pages/projects/ProjectList';
import ProjectDetails from '../pages/projects/ProjectDetails';
import ProjectSimulation from '../pages/projects/ProjectSimulation';
import RiskOverview from '../pages/dashboard/RiskOverview';

// (Optional) Login
// import Login from '../pages/auth/Login';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Main App Layout */}
      <Route element={<MainLayout />}>
  <Route path="/dashboard" element={<PortfolioDashboard />} />
  <Route path="/ranking" element={<ProjectRanking />} />
  <Route path="/risks" element={<RiskOverview />} />
  <Route path="/decisions" element={<DecisionLog />} />

  <Route path="/projects" element={<ProjectList />} />
  <Route path="/projects/:id" element={<ProjectDetails />} />
  <Route path="/projects/:id/simulate" element={<ProjectSimulation />} />
</Route>


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
