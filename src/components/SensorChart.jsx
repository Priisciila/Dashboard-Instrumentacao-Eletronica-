import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from '../utils/formatNumber.js'; // Adicionada extensão .js

function SensorChart({ data, dataKey, color, title }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid #333',
              borderRadius: '8px'
            }}
            formatter={(value) => [formatNumber(value), dataKey === 'temp' ? 'Temperatura' : 'Aceleração']}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#gradient-${dataKey})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SensorChart