import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sliders, TrendingUp, Target, DollarSign, Users } from 'lucide-react';

import PageContainer from '../../components/layout/PageContainer';
import StatCard from '../../components/common/StatCard';
import Loading from '../../components/common/Loading';

interface SimulationResult {
  currentHealth: number;
  simulatedHealth: number;
  delta: number;
}

const ProjectSimulation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const currentHealth = 68;

  const [extraBudget, setExtraBudget] = useState(0); // %
  const [extraTime, setExtraTime] = useState(0); // %
  const [extraPeople, setExtraPeople] = useState(0); // count

  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    // Mock loading of project data
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  }, []);

  const runSimulation = () => {
    // ===== SIMPLE SIMULATION LOGIC (backend will do real one) =====

    let improvement = 0;

    improvement += extraBudget * 0.2;  // budget helps reduce risk & delay
    improvement += extraTime * 0.15;   // time helps reduce delay
    improvement += extraPeople * 1.5;  // people directly improve progress

    const simulatedHealth = Math.min(100, Math.round(currentHealth + improvement));

    setResult({
      currentHealth,
      simulatedHealth,
      delta: simulatedHealth - currentHealth,
    });
  };

  if (isLoading) return <Loading text="Loading simulation engine..." />;

  return (
    <PageContainer
      title="What-if Simulation"
      subtitle={`Project ID: ${id}`}
      actions={
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </button>
      }
    >
      {/* Current State */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Current Health"
          value={`${currentHealth}%`}
          icon={Target}
          color={currentHealth >= 80 ? 'green' : currentHealth >= 60 ? 'yellow' : 'red'}
        />
        {result && (
          <>
            <StatCard
              title="Simulated Health"
              value={`${result.simulatedHealth}%`}
              icon={TrendingUp}
              color={result.simulatedHealth >= 80 ? 'green' : result.simulatedHealth >= 60 ? 'yellow' : 'red'}
            />
            <StatCard
              title="Improvement"
              value={`${result.delta > 0 ? '+' : ''}${result.delta}%`}
              icon={Sliders}
              color={result.delta >= 0 ? 'green' : 'red'}
            />
          </>
        )}
      </div>

      {/* Simulation Controls */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Simulation Parameters
        </h3>

        <div className="space-y-6">
          {/* Extra Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4" />
                Extra Budget (%)
              </div>
              <span className="font-semibold text-gray-900">{extraBudget}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={extraBudget}
              onChange={(e) => setExtraBudget(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Increase budget to reduce risk and unblock critical tasks.
            </p>
          </div>

          {/* Extra Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Target className="w-4 h-4" />
                Extend Timeline (%)
              </div>
              <span className="font-semibold text-gray-900">{extraTime}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={extraTime}
              onChange={(e) => setExtraTime(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adding time can reduce schedule pressure and rework.
            </p>
          </div>

          {/* Extra People */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="w-4 h-4" />
                Add Team Members
              </div>
              <span className="font-semibold text-gray-900">{extraPeople}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={extraPeople}
              onChange={(e) => setExtraPeople(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adding people can speed up execution but may increase coordination cost.
            </p>
          </div>
        </div>

        {/* Run Simulation Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={runSimulation}
            className="btn-primary flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            Run Simulation
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          How this simulation works
        </h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          This what-if engine estimates how changes in budget, timeline, and team size may impact the project’s
          health score. The real system will use portfolio metrics, risk exposure, and trend data to compute this
          more accurately. This simulation helps management test decisions before applying them.
        </p>
      </div>
    </PageContainer>
  );
};

export default ProjectSimulation;
