export const generateMockData = () => ({
  timestamp: new Date().toISOString(),
  acelerometro: {
    x: (Math.random() * 2 - 1).toFixed(2),
    y: (Math.random() * 0.5).toFixed(2),
    z: (Math.random() * -1).toFixed(2)
  },
  giroscopio: {
    x: (Math.random() * 0.5 - 0.25).toFixed(2),
    y: (Math.random() * -2).toFixed(2),
    z: (Math.random() * 0.1).toFixed(2)
  },
  magnetometro: {
    x: (Math.random() * 0.3).toFixed(2),
    y: (Math.random() * -0.5).toFixed(2),
    z: (Math.random() * 0.2).toFixed(2)
  },
  bmp180: {
    temperatura: (45 + Math.random() * 5).toFixed(1),
    pressao: (100 + Math.random() * 2).toFixed(2)
  }
})
