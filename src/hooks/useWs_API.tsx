import { useEffect, useState } from 'react';
import { useAxios } from './useAxios_API';

export const Ws = () => {
  const [messages, setMessages] = useState<Array<{ message: string }>>([{ message: '' }]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const axiosInstance = useAxios();
  const WS_URL = import.meta.env.VITE_WS_API

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axiosInstance.post(
          '/refresh-token',
          {},
        );
        return response.data.accessToken;
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        return null;
      }
    };

    const connectWebSocket = async () => {
      const accessToken = await refreshAccessToken();
      if (!accessToken) {
        console.error('Не удалось получить новый accessToken. Подключение к WebSocket отменено.');
        return;
      }

      const socket = new WebSocket(`${WS_URL}?token=${accessToken}`);

      socket.onopen = () => {
        console.log('WebSocket соединение установлено');
        setWs(socket);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message && typeof message.message === 'string') {
            setMessages((prevMessages) => [...prevMessages, message]);
          } else {
            console.warn('Некорректный формат сообщения:', message);
          }
        } catch (error) {
          console.error('Ошибка при парсинге сообщения:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket соединение закрыто');
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const sendMessage = (id: number) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'action', postId: id }));
    }
  };

  return { messages, sendMessage };
};