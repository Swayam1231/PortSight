import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import PortfolioDashboard from '../pages/dashboard/PortfolioDashboard';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PortfolioDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Placeholder routes - will implement later */}
      <Route path="/projects" element={<ProtectedRoute><MainLayout><div className="p-6">Projects Page Coming Soon...</div></MainLayout></ProtectedRoute>} />
      <Route path="/ranking" element={<ProtectedRoute><MainLayout><div className="p-6">Rankings Page Coming Soon...</div></MainLayout></ProtectedRoute>} />
      <Route path="/risks" element={<ProtectedRoute><MainLayout><div className="p-6">Risks Page Coming Soon...</div></MainLayout></ProtectedRoute>} />
      <Route path="/decisions" element={<ProtectedRoute><MainLayout><div className="p-6">Decisions Page Coming Soon...</div></MainLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><MainLayout><div className="p-6">Settings Page Coming Soon...</div></MainLayout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
