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
      // Arrays are 0-indexed, so we subtract 1. 
      // Y-axis is inverted (5 at top, 1 at bottom), so we do 5 - probability
      const x = risk.impact - 1;
      const y = 5 - risk.probability;
      if (x >= 0 && x < 5 && y >= 0 && y < 5) {
        matrix[y][x] += 1; // Count how many risks fall into this cell
      }
    });
    return matrix;
  }, [risks]);

  // Determine cell color based on its zone (Red = High Risk, Yellow = Med, Green = Low)
  const getCellColor = (x: number, y: number) => {
    const prob = 5 - y;
    const imp = x + 1;
    const score = prob * imp;

    if (score >= 15) return 'bg-red-500 text-white';
    if (score >= 8) return 'bg-amber-400 text-amber-900';
    return 'bg-emerald-400 text-emerald-900';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {/* Y-Axis Label */}
        <div className="flex flex-col justify-center items-center mr-4">
          <span className="transform -rotate-90 text-sm font-bold text-gray-500 tracking-widest whitespace-nowrap">
            PROBABILITY
          </span>
        </div>
        
        {/* The 5x5 Grid */}
        <div>
          <div className="grid grid-cols-5 gap-1 bg-gray-200 border-2 border-gray-300 p-1 rounded-lg">
            {grid.map((row, y) => (
              row.map((count, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-md font-bold text-lg shadow-sm ${getCellColor(x, y)} ${count === 0 ? 'opacity-40' : 'opacity-100 ring-2 ring-white scale-105 transform transition-transform'}`}
                >
                  {count > 0 ? count : ''}
                </div>
              ))
            ))}
          </div>
          {/* X-Axis Label */}
          <div className="flex justify-between mt-2 text-xs font-bold text-gray-400 px-2">
            <span>Low (1)</span>
            <span className="ml-8 text-gray-500 tracking-widest">IMPACT</span>
            <span>High (5)</span>
          </div>
        </div>
      </div>
    </div>
  );
}