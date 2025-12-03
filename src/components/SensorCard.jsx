import React from 'react';
import { formatNumber } from '../utils/formatNumber';

function SensorCard({ title, icon, data, unit, color, glowClass }) {
  // Garante que data não seja null/undefined
  const safeData = data || {};

  return (
    <div className={`glass rounded-xl p-5 ${glowClass} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
      </div>
      <div className="space-y-3">
        {Object.entries(safeData).map(([axis, value]) => (
          <div key={axis} className="flex justify-between items-center">
            <span className="text-gray-400 uppercase text-sm">{axis}</span>
            <span className="mono text-white text-lg font-medium">
              {formatNumber(value)} <span className="text-gray-500 text-sm">{unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SensorCard