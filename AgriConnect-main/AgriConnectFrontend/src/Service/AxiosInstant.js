import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const publicEndpoints = ['/api/auth/login', '/saveUser', '/admin/save-admin', '/user/api/forgot-password', '/user/api/reset-password'];
    const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    if (!isPublic) {
      const token = localStorage.getItem('token');
      if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
