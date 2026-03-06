import { useState, useEffect } from 'react';
import { Activity, FastForward, DollarSign, Clock, Users } from 'lucide-react';
import { projectAPI } from '../../api/api';

interface ProjectSimulatorProps {
  project: any;
}

export default function ProjectSimulator({ project }: ProjectSimulatorProps) {
  // State for the sliders (now allowing negative numbers!)
  const [addedBudget, setAddedBudget] = useState(0);
  const [addedDays, setAddedDays] = useState(0);
  const [addedTeam, setAddedTeam] = useState(0);
  
  // State for the prediction outputs
  const [predictedHealth, setPredictedHealth] = useState(0);
  const [baseHealth, setBaseHealth] = useState(0);

  // Calculate Base Health on load
  useEffect(() => {
    const totalRisk = project.risks?.reduce((sum: number, r: any) => sum + (r.probability * r.impact), 0) || 0;
    const initialHealth = Math.max(0, Math.min(100, (project.strategicValueScore * 10) - totalRisk));
    setBaseHealth(initialHealth);
    setPredictedHealth(initialHealth);
  }, [project]);

  // The AI Predictive Algorithm (handles positive AND negative scenarios)
  useEffect(() => {
    // Budget: +5 health per $50k added, -5 health per $50k cut
    const budgetBoost = (addedBudget / 50000) * 5; 

    // Time: More time = less pressure (+ health). Less time = rushed deadline (- health).
    const timeBoost = (addedDays / 14) * 2; 

    // Team: Hiring helps, losing people hurts
    const teamBoost = (addedTeam / 2) * 3; 
    
    // Complex Penalties
    const teamChaosPenalty = addedTeam > 10 ? -5 : 0; // Too many new people = chaos
    const teamLossPenalty = addedTeam <= -(project.teamSize / 2) ? -15 : 0; // Catastrophic penalty if half the team leaves!
    const timeBloatPenalty = addedDays > 60 ? ((addedDays - 60) / 30) * -3 : 0; // Too much time = bloat

    const newHealth = Math.max(0, Math.min(100, 
      baseHealth + budgetBoost + timeBoost + teamBoost + teamChaosPenalty + teamLossPenalty + timeBloatPenalty
    ));
    setPredictedHealth(Math.round(newHealth));
  }, [addedBudget, addedDays, addedTeam, baseHealth, project.teamSize]); 

  // Formatters for the UI so negative numbers look pretty (-$50,000 instead of +$-50,000)
  const formatCurrency = (val: number) => val === 0 ? '$0' : val > 0 ? `+$${val.toLocaleString()}` : `-$${Math.abs(val).toLocaleString()}`;
  const formatNum = (val: number, suffix: string) => val === 0 ? `0 ${suffix}` : val > 0 ? `+${val} ${suffix}` : `${val} ${suffix}`;
  const getHealthColor = (score: number) => score >= 75 ? 'text-emerald-500 border-emerald-500' : score >= 50 ? 'text-amber-500 border-amber-500' : 'text-red-500 border-red-500';

  const improvement = predictedHealth - baseHealth;

  // Maximum limits for cuts (cannot cut more budget/team than the project currently has)
  const maxBudgetCut = -(project.allocatedBudget || 100000);
  const maxTimeCut = -(project.expectedDurationDays ? project.expectedDurationDays - 1 : 30); // Leave at least 1 day
  const maxTeamCut = -(project.teamSize || 0);

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 text-white overflow-hidden mt-8">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-950">
        <FastForward className="text-blue-400" />
        <h3 className="font-bold text-lg">AI "What-If" Decision Simulator</h3>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: The Sliders */}
        <div className="space-y-6">
          <p className="text-sm text-slate-400 mb-4">Simulate the impact of resource injections, budget cuts, and deadline shifts.</p>
          
          {/* 1. Budget Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="flex items-center gap-1"><DollarSign size={16} className={addedBudget >= 0 ? "text-emerald-400" : "text-red-400"}/> Adjust Budget</span>
              <span className={addedBudget >= 0 ? "text-emerald-400" : "text-red-400"}>{formatCurrency(addedBudget)}</span>
            </div>
            <input 
              type="range" 
              min={maxBudgetCut} 
              max="500000" 
              step="10000" 
              value={addedBudget}
              onChange={(e) => setAddedBudget(Number(e.target.value))}
              className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${addedBudget >= 0 ? 'accent-emerald-500' : 'accent-red-500'}`}
            />
          </div>

          {/* 2. Timeline Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="flex items-center gap-1"><Clock size={16} className={addedDays >= 0 ? "text-blue-400" : "text-red-400"}/> Adjust Deadline</span>
              <span className={addedDays >= 0 ? "text-blue-400" : "text-red-400"}>{formatNum(addedDays, 'Days')}</span>
            </div>
            <input 
              type="range" 
              min={maxTimeCut} 
              max="120" 
              step="7" 
              value={addedDays}
              onChange={(e) => setAddedDays(Number(e.target.value))}
              className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${addedDays >= 0 ? 'accent-blue-500' : 'accent-red-500'}`}
            />
          </div>

          {/* 3. Team Size Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="flex items-center gap-1"><Users size={16} className={addedTeam >= 0 ? "text-purple-400" : "text-red-400"}/> Adjust Team Size</span>
              <span className={addedTeam >= 0 ? "text-purple-400" : "text-red-400"}>{formatNum(addedTeam, 'People')}</span>
            </div>
            <input 
              type="range" 
              min={maxTeamCut} 
              max="20" 
              step="1" 
              value={addedTeam}
              onChange={(e) => setAddedTeam(Number(e.target.value))}
              className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${addedTeam >= 0 ? 'accent-purple-500' : 'accent-red-500'}`}
            />
          </div>

          <button 
            onClick={async () => {
              try {
                // Change decision type based on if we are mostly cutting or adding
                const isNegative = addedBudget < 0 || addedDays < 0 || addedTeam < 0;
                await projectAPI.logDecision(project.id, {
                  userId: project.managerId, 
                  decisionType: isNegative ? 'REPLAN' : 'ACCELERATE',
                  rationale: `Simulated intervention: Adjusted budget by ${formatCurrency(addedBudget)}, timeline by ${formatNum(addedDays, 'days')}, and team size by ${formatNum(addedTeam, 'people')}. Resulted in a ${Math.abs(improvement)} point health ${improvement >= 0 ? 'increase' : 'decrease'}.`
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