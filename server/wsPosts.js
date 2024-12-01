import { WebSocketServer as Server } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
import { createPoolConnection } from '../src/common/common.js';
dotenv.config();

const port = process.env.WS_PORT

const wss = new Server({ port: port }); 
const pool = createPoolConnection();

wss.on('connection', (ws, req) => {
  console.log('Клиент подключен');
  
  (async () => {
    const response = await pool.query({ 
      text: 'SELECT * FROM posts'
    });
    
    ws.send(JSON.stringify({
      action: 'post_get',
      data: response.rows,
    }));
  })();

  ws.on('message', async(message) => {
    const data = JSON.parse(message);

    if (data.action === 'post_add') {
      const post_id = uuidv4();
      try {
        const response = await pool.query(
          `INSERT INTO posts (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
          [post_id, 'типо user_id', data.post]
        );

        if (response.rowCount > 0) {
          ws.send(JSON.stringify({ 
            action: 'post_add',
            data: {
              code: 200 
            }
          }));
        }
      }
      catch (error) {
        console.error('Ошибка при сохранении поста:', error);
        
        if (error.code === '23505') {
          ws.send(JSON.stringify({
            action: 'post_add',
            data: {
              status: 'error',
              code: 409,
              message: 'Пост с таким ID уже существует',
            }
          }));
        } else {
          ws.send(JSON.stringify({
            action: 'post_add',
            data: {
              status: 'error',
              code: 500,
              message: 'Внутренняя ошибка сервера',
              details: error.message,
            }
          }));
        }
      }
    }
  });

  setInterval(async() => {
    const response = await pool.query({ 
      text: 'SELECT * FROM posts'
    })

    ws.send(JSON.stringify({
      action: 'post_get',
      data: response.rows,
    }));
  }, 5000);

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log(`WebSocket сервер запущен на порту WS_PORT`);