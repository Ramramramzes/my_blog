import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAxios = () => {
  const navigate = useNavigate();

  const instance = axios.create({
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response, 
    (error) => {
      if (error.response.status === 403) {
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};