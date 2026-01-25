import React from 'react';
import type { Risk } from '../../types';

interface RiskHeatmapProps {
  risks: Risk[];
}

interface HeatmapCell {
  count: number;
  projects: string[];
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ risks }) => {
  // Initialize 4x4 grid (Low, Medium, High, Critical for both axes)
  const grid: HeatmapCell[][] = Array(4).fill(null).map(() => 
    Array(4).fill(null).map(() => ({ count: 0, projects: [] }))
  );

  // Populate grid with risk data
  risks.forEach(risk => {
    const impactIndex = Math.min(Math.floor(risk.impact / 25), 3);
    const probIndex = Math.min(Math.floor(risk.probability / 25), 3);
    grid[3 - impactIndex][probIndex].count++;
    grid[3 - impactIndex][probIndex].projects.push(risk.projectId);
  });

  const getColor = (count: number, row: number, col: number) => {
    if (count === 0) return 'bg-gray-50 border-gray-200';
    
    // Risk severity increases as you go right and up
    const riskLevel = row + col;
    
    if (riskLevel <= 2) return 'bg-green-100 border-green-300 text-green-700';
    if (riskLevel <= 4) return 'bg-yellow-100 border-yellow-300 text-yellow-700';
    if (riskLevel <= 5) return 'bg-orange-100 border-orange-300 text-orange-700';
    return 'bg-red-100 border-red-300 text-red-700';
  };

  const labels = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2">
            <div className="text-sm font-semibold text-gray-700 -rotate-90 whitespace-nowrap">
              Risk →
            </div>
            <div className="text-xs text-gray-500 -rotate-90 whitespace-nowrap mt-1">
              Impact ↓
            </div>
          </div>

          {/* Grid */}
          <div>
            {/* Column headers */}
            <div className="flex gap-2 mb-2 ml-2">
              {labels.map((label, i) => (
                <div key={i} className="w-24 text-center text-xs font-semibold text-gray-600">
                  {label}
                </div>
              ))}
            </div>

            {/* Rows */}
            {grid.map((row, i) => (
              <div key={i} className="flex gap-2 mb-2">
                {/* Row label */}
                <div className="w-16 flex items-center justify-end pr-2">
                  <span className="text-xs font-semibold text-gray-600">{labels[3 - i]}</span>
                </div>
                
                {/* Cells */}
                {row.map((cell, j) => (
                  <div
                    key={j}
                    className={`w-24 h-20 ${getColor(cell.count, i, j)} border-2 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer`}
                    title={cell.projects.length > 0 ? `Projects: ${cell.projects.join(', ')}` : 'No projects'}
                  >
                    {cell.count > 0 && (
                      <>
                        <span className="text-2xl font-bold">{cell.count}</span>
                        <span className="text-xs mt-1 opacity-75">
                          {cell.projects.slice(0, 2).join(', ')}
                          {cell.projects.length > 2 && '...'}
                        </span>
                      </>
                    )}
                    {cell.count === 0 && (
                      <span className="text-xl font-bold text-gray-300">0</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* X-axis label */}
          <div className="text-center mt-2">
            <div className="text-sm font-semibold text-gray-700">Strategic Priority →</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 border-2 border-green-300 rounded" />
          <span className="text-xs font-medium text-gray-600">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-300 rounded" />
          <span className="text-xs font-medium text-gray-600">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-200 border-2 border-orange-300 rounded" />
          <span className="text-xs font-medium text-gray-600">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border-2 border-red-300 rounded" />
          <span className="text-xs font-medium text-gray-600">Critical Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
