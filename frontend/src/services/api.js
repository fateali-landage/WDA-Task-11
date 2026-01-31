import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const res = await api.post('/auth/refresh');
      localStorage.setItem('token', res.data.token);
      err.config.headers.Authorization = `Bearer ${res.data.token}`;
      return api(err.config);
    }
    return Promise.reject(err);
  }
);

export default api;
