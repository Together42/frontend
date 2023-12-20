import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/function/getAddress';

const apiClient = axios.create({
  baseURL: getAddress(),
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => {
    Promise.reject(error);
  },
);

export default apiClient;
