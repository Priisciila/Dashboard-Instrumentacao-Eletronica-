import React from 'react';
import { formatNumber } from '../utils/formatNumber';

function Console({ data }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-green-400">▶</span>
        <h3 className="text-white font-semibold">Console de Dados</h3>
      </div>
      <div className="bg-black/50 rounded-lg p-4 mono text-sm overflow-x-auto space-y-1">
        <p className="text-gray-500">=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=</p>
        <p className="text-green-400">vTaskWiFi: DADOS RECEBIDOS</p>
        
        {/* Orientação e Altitude */}
        <p className="text-blue-400">
          [ORIENTACAO (graus)] Pitch: {formatNumber(data.orientation.pitch)} | Roll: {formatNumber(data.orientation.roll)} | Yaw: {formatNumber(data.orientation.yaw)} | Altitude: {formatNumber(data.orientation.altitude)}
        </p>

        {/* Aceleração (unidade atualizada para g) */}
        <p className="text-cyan-400">
          [ACELERACAO (g)] X: {formatNumber(data.acelerometro.x)} | Y: {formatNumber(data.acelerometro.y)} | Z: {formatNumber(data.acelerometro.z)}
        </p>

        {/* Giroscópio */}
        <p className="text-emerald-400">
          [GIROSCOPIO (dps)] X: {formatNumber(data.giroscopio.x)} | Y: {formatNumber(data.giroscopio.y)} | Z: {formatNumber(data.giroscopio.z)}
        </p>

        {/* Magnetômetro */}
        <p className="text-purple-400">
          [MAGNETOMETRO (gauss)] X: {formatNumber(data.magnetometro.x)} | Y: {formatNumber(data.magnetometro.y)} | Z: {formatNumber(data.magnetometro.z)}
        </p>

        {/* BMP180 */}
        <p className="text-orange-400">
          [BMP180] Temperatura (°C): {formatNumber(data.bmp180.temperatura)} | Pressao (kPa): {formatNumber(data.bmp180.pressao)}
        </p>
      </div>
    </div>
  )
}

export default Console