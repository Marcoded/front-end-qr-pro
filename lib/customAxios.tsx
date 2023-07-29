import axios, { AxiosInstance } from 'axios';
import urlMaker from './urlMaker';
import { useAuth } from '@clerk/nextjs';

const CustomAxios = (): AxiosInstance => {
  const { getToken } = useAuth();
  const instance = axios.create();

  instance.defaults.baseURL = urlMaker();

  instance.interceptors.request.use(
    async config => {
      const token = await getToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    error => Promise.reject(error)
  );

  return instance;
};

export default CustomAxios;