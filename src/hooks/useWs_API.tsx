import { useEffect, useState } from 'react';
import { useAxios } from './useAxios_API';

export const Ws = () => {
  const [postData, setPostData] = useState([]);
  const [postAddStatus, setPostAddStatus] = useState({});
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

      //? Функция получени сообщений с бека, обрабатываем по разным статусам message.action
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          //todo Добавить алерт при ошибке
          if (message?.error ) console.log(message.error);
          //todo===========================================

          switch (message.action) {
            case 'post_get':
              setPostData(message.data);
              break;
            case 'post_add':
              setPostAddStatus(message.data);
              break;
            default:
              console.log('Неизвестное сообщение:', message);
          }

        } catch (error) {
          //todo Добавить алерт при ошибке
          console.error('Ошибка при парсинге сообщения:', error);
          //todo===========================================
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

  //? Функция отправки запроса поста на бек ==>
  const sendPost = (post: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'post_add', post: post }));
    }
  }

  return { 
    sendPost,
    postData,
    postAddStatus,
  };
};