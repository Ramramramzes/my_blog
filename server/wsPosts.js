import { WebSocketServer as Server } from 'ws';
import dotenv from 'dotenv'
dotenv.config();

const port = process.env.WS_PORT

const wss = new Server({ port: port }); 

wss.on('connection', (ws, req) => {
    console.log('Клиент подключен');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.action === 'action') {
            console.log('Пришли', data);
            ws.send(JSON.stringify({ message: `Прислал ${data?.postId || ''}` }));
        }
    });

    setInterval(() => {
        ws.send(JSON.stringify({ message: 'Обновление данных в реальном времени' }));
    }, 3000);

    ws.on('close', () => {
        console.log('Клиент отключился');
    });
});

console.log(`WebSocket сервер запущен на порту WS_PORT`);