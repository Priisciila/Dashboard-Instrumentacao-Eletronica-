import { useState, useEffect, useRef } from 'react'
import SensorCard from './components/SensorCard.jsx'
import EnvironmentCard from './components/EnvironmentCard.jsx'
import SensorChart from './components/SensorChart.jsx'
import Console from './components/Console.jsx'
import Header from './components/Header.jsx'
import './App.css'
import { formatNumber } from './utils/formatNumber.js';

const API_URL = '/sensores'; 

// Estado inicial compatível com o JSON do ESP32
const initialData = {
  acelerometro: { x: 0, y: 0, z: 0 },
  giroscopio: { x: 0, y: 0, z: 0 },
  magnetometro: { x: 0, y: 0, z: 0 },
  bmp180: { temperatura: 0, pressao: 0 },
  orientation: { pitch: 0, roll: 0, yaw: 0, altitude: 0 },
  status: 'AGUARDANDO...',
  timestamp: null
};

function App() {
  const [currentData, setCurrentData] = useState(initialData)
  const [history, setHistory] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const lastTimestampRef = useRef(null);
  const fullHistoryRef = useRef([]);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const rawData = await response.json();
      
      // Mapeamento direto: O JSON do ESP já vem estruturado corretamente agora.
      // Apenas garantimos valores padrão caso algum campo venha null.
      const processedData = {
        timestamp: rawData.timestamp,
        status: rawData.status || 'NORMAL',
        acelerometro: rawData.acelerometro || initialData.acelerometro,
        giroscopio: rawData.giroscopio || initialData.giroscopio,
        magnetometro: rawData.magnetometro || initialData.magnetometro,
        bmp180: rawData.bmp180 || initialData.bmp180,
        orientation: rawData.orientation || initialData.orientation
      };

      setCurrentData(processedData);
      
      // Só incrementa contador se o timestamp mudou (novo pacote)
      if (processedData.timestamp && processedData.timestamp !== lastTimestampRef.current) {
        setUpdateCount(prev => prev + 1);
        lastTimestampRef.current = processedData.timestamp;
        
        // Adiciona ao histórico completo para salvar depois
        fullHistoryRef.current.push(processedData);
      }

      // Se o backend mandou resetar o contador
      if (rawData.reset) {
        setUpdateCount(0);
      }
      
      setIsConnected(true);
      setErrorMessage(null);

      // Atualiza histórico para os gráficos
      setHistory(prev => {
        const timeStr = rawData.timestamp 
          ? new Date(rawData.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          : '--:--';

        const newEntry = {
          time: timeStr,
          temp: parseFloat(processedData.bmp180.temperatura), 
          // Usamos Acel X para o gráfico. O ESP envia como número, garantimos float.
          accelX: parseFloat(processedData.acelerometro.x), 
        };
        
        const newHistory = [...prev, newEntry];
        return newHistory.slice(-20); // Mantém últimos 20 pontos
      })

    } catch (error) {
      console.error("Erro fetch:", error.message);
      setIsConnected(false);
      setErrorMessage(`Erro ao conectar: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData(); 
    const interval = setInterval(fetchData, 1000); // Atualiza a cada 1s
    return () => clearInterval(interval);
  }, []); 

  const getStatusColor = (status) => {
    if (status === 'CONECTADO' || status === 'NORMAL') return 'text-green-400';
    if (status === 'AGUARDANDO...') return 'text-yellow-500';
    return 'text-gray-500';
  };

  const handleSaveHistory = async () => {
    if (fullHistoryRef.current.length === 0) {
      alert("Não há dados para salvar ainda.");
      return;
    }

    // Cabeçalho do arquivo
    let content = "Timestamp\tStatus\tTemp(C)\tPressao(Pa)\tAccelX\tAccelY\tAccelZ\tGiroX\tGiroY\tGiroZ\tMagX\tMagY\tMagZ\tPitch\tRoll\tYaw\tAltitude\n";

    // Linhas de dados
    fullHistoryRef.current.forEach(d => {
      const time = d.timestamp ? new Date(d.timestamp).toLocaleString('pt-BR') : 'N/A';
      const line = `${time}\t${d.status}\t${d.bmp180.temperatura}\t${d.bmp180.pressao}\t${d.acelerometro.x}\t${d.acelerometro.y}\t${d.acelerometro.z}\t${d.giroscopio.x}\t${d.giroscopio.y}\t${d.giroscopio.z}\t${d.magnetometro.x}\t${d.magnetometro.y}\t${d.magnetometro.z}\t${d.orientation.pitch}\t${d.orientation.roll}\t${d.orientation.yaw}\t${d.orientation.altitude}\n`;
      content += line;
    });

    try {
      // Tenta usar a API moderna de File System Access (Chrome/Edge)
      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName: `historico_leituras_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`,
          types: [{
            description: 'Arquivo de Texto',
            accept: { 'text/plain': ['.txt'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
      } else {
        // Fallback para download clássico
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `historico_leituras_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Erro ao salvar:', err);
        alert('Erro ao salvar arquivo.');
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#0a0a0f]">
      <Header isConnected={isConnected} updateCount={updateCount} /> 

      {/* Status Bar */}
      <div className="glass rounded-xl p-3 mb-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">📡 Status:</span>
          {errorMessage ? (
            <span className="mono text-red-500 text-sm">{errorMessage}</span>
          ) : (
            <span className={`mono text-sm font-bold ${getStatusColor(currentData.status)}`}>
              {currentData.status}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={handleSaveHistory}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded transition-colors flex items-center gap-1"
            >
                💾 Salvar Histórico
            </button>
            <div className="mono text-gray-500 text-sm">
            {currentData.timestamp ? new Date(currentData.timestamp).toLocaleString('pt-BR') : '--/--/----'}
            </div>
        </div>
      </div>

      {/* Grid de Sensores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SensorCard
          title="Acelerômetro"
          icon="📊"
          data={currentData.acelerometro}
          unit="g"
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
          unit="T"
          color="from-purple-500 to-pink-500"
          glowClass="glow-purple"
        />
        <EnvironmentCard
          temperatura={currentData.bmp180.temperatura}
          pressao={currentData.bmp180.pressao}
        />
      </div>
      
      {/* Nova Seção: Orientação e Altitude (Dados novos do ESP) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
         <div className="glass rounded-xl p-5 glow-orange lg:col-span-4 flex justify-around items-center flex-wrap gap-4">
            <div className="text-center">
                <span className="text-gray-400 text-sm uppercase block mb-1">Altitude</span>
                <span className="text-3xl font-bold text-white mono">{formatNumber(currentData.orientation.altitude)} <span className="text-sm text-gray-500">m</span></span>
            </div>
            <div className="h-10 w-[1px] bg-gray-700 hidden md:block"></div>
            <div className="text-center">
                <span className="text-gray-400 text-sm uppercase block mb-1">Pitch</span>
                <span className="text-xl font-bold text-blue-400 mono">{formatNumber(currentData.orientation.pitch)}°</span>
            </div>
            <div className="text-center">
                <span className="text-gray-400 text-sm uppercase block mb-1">Roll</span>
                <span className="text-xl font-bold text-green-400 mono">{formatNumber(currentData.orientation.roll)}°</span>
            </div>
            <div className="text-center">
                <span className="text-gray-400 text-sm uppercase block mb-1">Yaw</span>
                <span className="text-xl font-bold text-purple-400 mono">{formatNumber(currentData.orientation.yaw)}°</span>
            </div>
         </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SensorChart
          data={history}
          dataKey="accelX"
          color="#3b82f6"
          title="📈 Acelerômetro X (Tempo Real)"
        />
        <SensorChart
          data={history}
          dataKey="temp"
          color="#f97316"
          title="🌡️ Temperatura (Tempo Real)"
        />
      </div>

      {/* Console */}
      <Console data={currentData} />

      <footer className="mt-6 text-center text-gray-500 text-sm">
        <p>Instrumentação Eletrônica • UNIVASF</p>
      </footer>
    </div>
  )
}

export default App