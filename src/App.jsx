import { useState, useEffect } from 'react'
import SensorCard from './components/SensorCard'
import EnvironmentCard from './components/EnvironmentCard'
import SensorChart from './components/SensorChart'
import Console from './components/Console'
import Header from './components/Header'
import { generateMockData } from './utils/mockData'
import './App.css'

function App() {
  const [currentData, setCurrentData] = useState(generateMockData())
  const [history, setHistory] = useState([])
  const [isConnected, setIsConnected] = useState(true)
  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateMockData()
      setCurrentData(newData)
      setUpdateCount(prev => prev + 1)

      setHistory(prev => {
        const newHistory = [...prev, {
          time: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }),
          accelX: parseFloat(newData.acelerometro.x),
          accelY: parseFloat(newData.acelerometro.y),
          accelZ: parseFloat(newData.acelerometro.z),
          temp: parseFloat(newData.bmp180.temperatura)
        }]
        return newHistory.slice(-20)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-6 bg-[#0a0a0f]">
      <Header isConnected={isConnected} updateCount={updateCount} />

      {/* Status Bar */}
      <div className="glass rounded-xl p-3 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">📡 vTaskWiFi:</span>
          <span className="mono text-green-400 text-sm">DADOS RECEBIDOS</span>
        </div>
        <div className="mono text-gray-500 text-sm">
          {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Grid de Sensores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SensorCard
          title="Acelerômetro"
          icon="📊"
          data={currentData.acelerometro}
          unit="m/s²"
          color="from-blue-500 to-cyan-500"
          glowClass="glow-blue"
        />
        <SensorCard
          title="Giroscópio"
          icon="🔄"
          data={currentData.giroscopio}
          unit="dps"
          color="from-green-500 to-emerald-500"
          glowClass="glow-green"
        />
        <SensorCard
          title="Magnetômetro"
          icon="🧭"
          data={currentData.magnetometro}
          unit="gauss"
          color="from-purple-500 to-pink-500"
          glowClass="glow-purple"
        />
        <EnvironmentCard
          temperatura={currentData.bmp180.temperatura}
          pressao={currentData.bmp180.pressao}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SensorChart
          data={history}
          dataKey="accelX"
          color="#3b82f6"
          title="📈 Acelerômetro X (Histórico)"
        />
        <SensorChart
          data={history}
          dataKey="temp"
          color="#f97316"
          title="🌡️ Temperatura (Histórico)"
        />
      </div>

      {/* Console */}
      <Console data={currentData} />

      {/* Footer */}
      <footer className="mt-6 text-center text-gray-500 text-sm">
        <p>Instrumentação Eletrônica • UNIVASF</p>
      </footer>
    </div>
  )
}

export default App
