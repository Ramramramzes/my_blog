import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAxios = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_AUTH_BASEURL

  const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403) {
        navigate('/login');
      } else if (error.response && error.response.status === 401) {
        console.log('Ошибка авторизации, возможно токен истек');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};