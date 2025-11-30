function Header({ isConnected, updateCount }) {
  return (
    <header className="glass rounded-xl p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
          📡
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">Dashboard de Telemetria</h1>
          <p className="text-gray-400 text-sm">Instrumentação Eletrônica</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 pulse-dot' : 'bg-red-500'}`}></div>
          <span className="text-gray-300 text-sm">{isConnected ? 'Conectado' : 'Desconectado'}</span>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">Pacotes recebidos</p>
          <p className="mono text-white font-bold">{updateCount}</p>
        </div>
      </div>
    </header>
  )
}

export default Header
