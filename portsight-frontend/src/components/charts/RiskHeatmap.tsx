import { useMemo } from 'react';

interface Risk {
  id: string;
  title: string;
  probability: number; // 1 to 5
  impact: number;      // 1 to 5
}

export default function RiskHeatmap({ risks }: { risks: Risk[] }) {
  // Create a 5x5 grid structure
  const grid = useMemo(() => {
    const matrix = Array(5).fill(null).map(() => Array(5).fill(0));
    risks.forEach(risk => {
      // Arrays are 0-indexed. Y-axis is inverted (5 at top)
      const x = risk.impact - 1;
      const y = 5 - risk.probability; 
      if (x >= 0 && x < 5 && y >= 0 && y < 5) {
        matrix[y][x] += 1;
      }
    });
    return matrix;
  }, [risks]);

  // Determine standard 4-tier enterprise risk colors
  const getCellColor = (x: number, y: number) => {
    const prob = 5 - y;
    const imp = x + 1;
    const score = prob * imp;

    if (score >= 15) return 'bg-red-500 text-white border-red-600';           // Critical
    if (score >= 10) return 'bg-orange-400 text-white border-orange-500';    // High
    if (score >= 5) return 'bg-amber-300 text-amber-900 border-amber-400';   // Medium
    return 'bg-emerald-400 text-emerald-900 border-emerald-500';             // Low
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="flex">
        
        {/* Left Side: Y-Axis Label & Numbers */}
        <div className="flex">
          {/* Vertical Label */}
          <div className="flex flex-col justify-center items-center mr-2 w-6 relative">
            <span className="transform -rotate-90 text-xs font-black text-gray-400 tracking-widest whitespace-nowrap absolute">
              PROBABILITY
            </span>
          </div>
          
          {/* 5-1 Numbers */}
          <div className="flex flex-col justify-around py-2 mr-3 text-xs font-bold text-gray-400">
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
          </div>
        </div>
        
        {/* Center: The Grid and X-Axis */}
        <div className="flex flex-col">
          
          {/* The 5x5 Matrix */}
          <div className="grid grid-cols-5 gap-1.5 bg-gray-50 border border-gray-200 p-2 rounded-xl shadow-inner w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]">
            {grid.map((row, y) => (
              row.map((count, x) => {
                const isActive = count > 0;
                return (
                  <div 
                    key={`${x}-${y}`} 
                    className={`
                      relative flex items-center justify-center rounded-lg font-bold text-lg sm:text-xl border
                      ${getCellColor(x, y)}
                      ${isActive ? 'opacity-100 shadow-md ring-2 ring-white z-10' : 'opacity-25 hover:opacity-40'}
                    `}
                  >
                    {isActive ? count : ''}
                  </div>
                );
              })
            ))}
          </div>

          {/* Bottom: X-Axis Numbers */}
          <div className="flex px-2 mt-3">
            <div className="w-full flex justify-between text-xs font-bold text-gray-400 px-3 sm:px-4">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          {/* Bottom: X-Axis Label */}
          <div className="text-center mt-1 text-xs font-black text-gray-400 tracking-widest">
            IMPACT
          </div>
          
        </div>
      </div>
    </div>
  );
}