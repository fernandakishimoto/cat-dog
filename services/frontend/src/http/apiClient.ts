import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  if (match) {
    config.headers.Authorization = `Bearer ${decodeURIComponent(match[1])}`;
  }
  return config;
});

export default apiClient;
