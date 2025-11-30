function Console({ data }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-green-400">▶</span>
        <h3 className="text-white font-semibold">Console de Dados</h3>
      </div>
      <div className="bg-black/50 rounded-lg p-4 mono text-sm overflow-x-auto">
        <p className="text-gray-500">=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=</p>
        <p className="text-green-400">vTaskWiFi: DADOS RECEBIDOS</p>
        <p className="text-cyan-400">
          [ACELERACAO (m/s2)] X: {data.acelerometro.x} | Y: {data.acelerometro.y} | Z: {data.acelerometro.z}
        </p>
        <p className="text-emerald-400">
          [GIROSCOPIO (dps)] X: {data.giroscopio.x} | Y: {data.giroscopio.y} | Z: {data.giroscopio.z}
        </p>
        <p className="text-purple-400">
          [MAGNETOMETRO (gauss)] X: {data.magnetometro.x} | Y: {data.magnetometro.y} | Z: {data.magnetometro.z}
        </p>
        <p className="text-orange-400">
          [BMP180] Temperatura (°C): {data.bmp180.temperatura} | Pressao (kPa): {data.bmp180.pressao}
        </p>
      </div>
    </div>
  )
}

export default Console
