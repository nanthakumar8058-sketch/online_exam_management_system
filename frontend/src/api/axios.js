import axios from 'axios';

const isProduction = import.meta.env.MODE === 'production';

const api = axios.create({
  baseURL: isProduction 
    ? 'https://exam-management-system-za7l.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
