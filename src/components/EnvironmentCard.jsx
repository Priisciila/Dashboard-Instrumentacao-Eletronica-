import React from 'react';
import { formatNumber } from '../utils/formatNumber';

function EnvironmentCard({ temperatura, pressao }) {
  return (
    <div className="glass rounded-xl p-5 glow-orange transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <span className="text-xl">🌡️</span>
        </div>
        <h3 className="text-white font-semibold text-lg">Termômetro/Barômetro</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Temperatura</p>
          <p className="mono text-3xl font-bold text-orange-400">{formatNumber(temperatura)}°C</p>
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Pressão</p>
          <p className="mono text-3xl font-bold text-blue-400">{formatNumber(pressao)} <span className="text-lg">kPa</span></p>
        </div>
      </div>
    </div>
  )
}

export default EnvironmentCard