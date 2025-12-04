// Certifique-se de que instalou as dependências: npm install express cors
// E de que o seu package.json tem "type": "module"
import express from 'express';
import cors from 'cors'; 
import os from 'os'; 

const app = express();
const PORT = 4000; 

// 1. Inicializa os dados com a estrutura EXATA que o ESP32 envia (baseado no seu código C)
// Isso evita que o frontend quebre se tentar ler "bmp180.temperatura" antes do primeiro envio.
let latestSensorData = {
    timestamp: null,
    status: 'AGUARDANDO DADOS...',
    acelerometro: { x: 0, y: 0, z: 0 },
    giroscopio: { x: 0, y: 0, z: 0 },
    magnetometro: { x: 0, y: 0, z: 0 },
    bmp180: { temperatura: 0, pressao: 0 },
    orientation: { pitch: 0, roll: 0, yaw: 0, altitude: 0 }
};

let connectionTimeout = null;
let dataResetTimeout = null;

app.use(cors());
app.use(express.json()); 

const getLocalIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const iface = interfaces[interfaceName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1'; 
};

// ======================================================================
// Rotas
// ======================================================================

// Rota POST /sensores: O ESP32 envia os dados para cá
app.post('/sensores', (req, res) => {
    // Verifica se o JSON tem conteúdo
    if (req.body && Object.keys(req.body).length > 0) {
        
        // Atualiza a variável global com o JSON recebido do ESP
        latestSensorData = {
            ...latestSensorData, // Mantém campos antigos se faltar algo
            ...req.body,         // Sobrescreve com os dados novos do ESP
            timestamp: new Date().toISOString(),
            status: 'CONECTADO',
            reset: false
        };

        // Reinicia o timer de timeout
        if (connectionTimeout) clearTimeout(connectionTimeout);
        if (dataResetTimeout) clearTimeout(dataResetTimeout);

        connectionTimeout = setTimeout(() => {
            console.log(`\n[TIMEOUT] Sem dados por 4s. Status alterado para AGUARDANDO DADOS...`);
            latestSensorData.status = 'AGUARDANDO DADOS...';
            latestSensorData.timestamp = null;

            // Inicia timer para zerar os dados após 20s de "AGUARDANDO DADOS..."
            dataResetTimeout = setTimeout(() => {
                console.log(`\n[RESET] Sem dados por +20s. Zerando valores dos sensores.`);
                latestSensorData = {
                    timestamp: null,
                    status: 'AGUARDANDO DADOS...',
                    reset: true, // Flag para avisar o frontend para zerar o contador
                    acelerometro: { x: 0, y: 0, z: 0 },
                    giroscopio: { x: 0, y: 0, z: 0 },
                    magnetometro: { x: 0, y: 0, z: 0 },
                    bmp180: { temperatura: 0, pressao: 0 },
                    orientation: { pitch: 0, roll: 0, yaw: 0, altitude: 0 }
                };
            }, 20000);

        }, 4000);

        console.log(`\n[POST] Dados recebidos do ESP32 em /sensores às ${new Date().toLocaleTimeString()}`);
        // console.log(JSON.stringify(req.body, null, 2)); // Debug: mostra o JSON recebido
        
        res.status(200).send({ message: "JSON recebido com sucesso!" });
    } else {
        console.warn(`[POST] Recebido request vazio em /sensores`);
        res.status(400).send({ message: "JSON inválido ou vazio." });
    }
});

// Rota GET /sensores: O Frontend React lê os dados daqui
app.get('/sensores', (req, res) => {
    res.json(latestSensorData);
});

// Inicializa o servidor
app.listen(PORT, '0.0.0.0', () => { 
    const localIP = getLocalIpAddress();
    console.log(`\n======================================================`);
    console.log(`🔥 Servidor Backend Rodando!`);
    console.log(`📡 ESP32 deve fazer POST em: http://${localIP}:${PORT}/sensores`);
    console.log(`💻 React deve fazer GET em:  http://localhost:${PORT}/sensores`);
    console.log(`======================================================\n`);
});