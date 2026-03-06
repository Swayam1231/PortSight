import { useState, useEffect } from 'react';
import { Activity, FastForward, DollarSign, Clock } from 'lucide-react';
import { projectAPI } from '../../api/api';

interface ProjectSimulatorProps {
  project: any;
}

export default function ProjectSimulator({ project }: ProjectSimulatorProps) {
  // State for the sliders
  const [addedBudget, setAddedBudget] = useState(0);
  const [addedDays, setAddedDays] = useState(0);
  
  // State for the prediction outputs
  const [predictedHealth, setPredictedHealth] = useState(0);
  const [baseHealth, setBaseHealth] = useState(0);

  // Calculate Base Health on load
  useEffect(() => {
    const totalRisk = project.risks.reduce((sum: number, r: any) => sum + (r.probability * r.impact), 0);
    // Base formula: (Value * 10) - Total Risk
    const initialHealth = Math.max(0, Math.min(100, (project.strategicValueScore * 10) - totalRisk));
    setBaseHealth(initialHealth);
    setPredictedHealth(initialHealth);
  }, [project]);

  // The AI Predictive Algorithm (runs whenever sliders move)
  useEffect(() => {
    // Injecting budget improves health (allows hiring more people, buying better tools)
    const budgetBoost = (addedBudget / 50000) * 5; // +5 health points per $50k
    
    // Extending the deadline reduces timeline pressure/risk, improving health
    const timeBoost = (addedDays / 14) * 2; // +2 health points per 2 weeks added
    
    // If they add WAY too much time, it actually hurts health (bloat/delay)
    const timePenalty = addedDays > 60 ? ((addedDays - 60) / 30) * -3 : 0;

    const newHealth = Math.max(0, Math.min(100, baseHealth + budgetBoost + timeBoost + timePenalty));
    setPredictedHealth(Math.round(newHealth));
  }, [addedBudget, addedDays, baseHealth]);

  // Determine color of the prediction circle
  const getHealthColor = (score: number) => {
    if (score >= 75) return 'text-emerald-500 border-emerald-500';
    if (score >= 50) return 'text-amber-500 border-amber-500';
    return 'text-red-500 border-red-500';
  };

  const improvement = predictedHealth - baseHealth;

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 text-white overflow-hidden mt-8">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-950">
        <FastForward className="text-blue-400" />
        <h3 className="font-bold text-lg">AI "What-If" Decision Simulator</h3>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: The Sliders */}
        <div className="space-y-6">
          <p className="text-sm text-slate-400 mb-4">Simulate management interventions to see the predicted outcome on project health.</p>
          
          <div>
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="flex items-center gap-1"><DollarSign size={16} className="text-emerald-400"/> Inject Budget</span>
              <span className="text-emerald-400">+${addedBudget.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="500000" 
              step="10000" 
              value={addedBudget}
              onChange={(e) => setAddedBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="flex items-center gap-1"><Clock size={16} className="text-blue-400"/> Extend Timeline</span>
              <span className="text-blue-400">+{addedDays} Days</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="120" 
              step="7" 
              value={addedDays}
              onChange={(e) => setAddedDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <button 
            onClick={async () => {
              try {
                await projectAPI.logDecision(project.id, {
                  userId: project.managerId, // Simulating the manager making the call
                  decisionType: addedBudget > 0 ? 'ACCELERATE' : 'REPLAN',
                  rationale: `Simulated intervention: Added $${addedBudget.toLocaleString()} budget and extended timeline by ${addedDays} days to improve health by ${improvement} points.`
                });
                alert('✅ Decision successfully recorded in the Governance Audit Log!');
              } catch (error) {
                alert('Failed to log decision. Check console.');
              }
            }}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors mt-4"
          >
            Apply Decision to Project
          </button>
        </div>

        {/* Right Side: The Prediction Engine */}
        <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <p className="text-sm text-slate-400 font-semibold mb-4 uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} /> Predicted Health Score
          </p>
          
          <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${getHealthColor(predictedHealth)} shadow-[0_0_30px_rgba(0,0,0,0.3)] shadow-${getHealthColor(predictedHealth).split(' ')[0].replace('text-', '')}`}>
            <span className="text-4xl font-black">{predictedHealth}</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>

          {improvement !== 0 && (
            <div className={`mt-6 px-4 py-1 rounded-full text-sm font-bold ${improvement > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {improvement > 0 ? '▲' : '▼'} {Math.abs(improvement)} Points {improvement > 0 ? 'Improvement' : 'Decline'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}