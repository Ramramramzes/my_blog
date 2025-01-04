import { WebSocketServer as Server } from 'ws';
import { WebSocket } from 'ws';
import dotenv from 'dotenv';
import { createPoolConnection } from '../src/common/common.js';
import { post_add, post_update } from './post_action.js';
dotenv.config();

const port = process.env.WS_PORT;

const wss = new Server({ port: port }); 
const pool = createPoolConnection();

(async () => {
  const client = await pool.connect();
  console.log('Подключение к PostgreSQL успешно.');

  try {
    await client.query('LISTEN post_changes');
    console.log('Подписка на канал post_changes выполнена.');

    client.on('notification', async (msg) => {
      if (msg.channel === 'post_changes') {
        try {
          const payload = JSON.parse(msg.payload);
          console.log('Изменение в базе данных:', payload);

          const response = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                action: 'post_get',
                data: response.rows,
              }));
            }
          });
          console.log('Обновлённые данные отправлены всем клиентам.');
        } catch (err) {
          console.error('Ошибка обработки уведомления:', err);
        }
      }
    });

    client.on('error', (err) => {
      console.error('Ошибка клиента PostgreSQL (уведомления):', err.stack);
    });
  } catch (err) {
    console.error('Ошибка подписки на уведомления:', err.stack);
    client.release();
  }
})();

wss.on('connection', (ws) => {
  console.log('Клиент подключен');
  console.log(`Общее количество клиентов: ${wss.clients.size}`);

  (async () => {
    try {
      const response = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
      ws.send(JSON.stringify({
        action: 'post_get',
        data: response.rows,
      }));
      console.log('Отправлены текущие посты клиенту');
    } catch (err) {
      console.error('Ошибка при получении постов:', err.stack);
      ws.send(JSON.stringify({
        action: 'error',
        data: {
          code: 500,
          message: 'Не удалось получить данные.',
        }
      }));
    }
  })();


  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      switch (data.action) {
        case 'post_add':
          post_add(data, ws, pool);
          break;

        case 'post_update':
          post_update(data, ws, pool);
          break;

        case 'post_delete':
          post_delete(data, ws, pool);
          break;

        default:
          ws.send(JSON.stringify({
            action: 'error',
            data: {
              status: 'error',
              code: 400,
              message: 'Неизвестное действие. Проверьте поле "action".',
            }
          }));
          break;
      }
    } catch (err) {
      console.error('Ошибка при обработке сообщения:', err.stack);
      ws.send(JSON.stringify({
        action: 'error',
        data: {
          code: 400,
          message: 'Некорректный формат сообщения.',
        }
      }));
    }
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log(`WebSocket сервер запущен на порту ${port}`);