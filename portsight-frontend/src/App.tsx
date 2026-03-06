import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PortfolioDashboard from './pages/dashboard/PortfolioDashboard';
import ProjectList from './pages/projects/ProjectList';
import RiskOverview from './pages/dashboard/RiskOverview';
import ProjectRanking from './pages/dashboard/ProjectRanking'; // <-- Import the new page
import ProjectDetails from './pages/projects/ProjectDetails';
import DecisionLog from './pages/dashboard/DecisionLog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PortfolioDashboard />} /> 
          <Route path="projects" element={<ProjectList />} /> 
          <Route path="risks" element={<RiskOverview />} /> 
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="decisions" element={<DecisionLog />} />
          <Route path="ranking" element={<ProjectRanking />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;