import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrihub_token') || localStorage.getItem('krishisetu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth API
export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  demoLogin: () => api.post('/api/auth/demo-login'),
  getMe: () => api.get('/api/auth/me')
};

// Farmer Profile API
export const farmerApi = {
  getProfile: () => api.get('/api/farmers/profile'),
  updateProfile: (data) => api.put('/api/farmers/profile', data)
};

// Crops API
export const cropsApi = {
  getCrops: () => api.get('/api/crops'),
  getCropByName: (name) => api.get(`/api/crops/${encodeURIComponent(name)}`)
};

// Diagnosis & Treatment API
export const diagnosisApi = {
  diagnoseCrop: (formData) => {
    return api.post('/api/diagnosis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  diagnoseCropJson: (data) => api.post('/api/diagnosis', data),
  getHistory: () => api.get('/api/diagnosis/history'),
  getTreatment: (condition) => api.get(`/api/treatments/${encodeURIComponent(condition)}`)
};

// Market Prices API (Indicative e-NAM)
export const marketApi = {
  getPrices: (params) => api.get('/api/market-prices', { params }),
  getPricesByCrop: (crop) => api.get(`/api/market-prices/${encodeURIComponent(crop)}`)
};

// Buyers & FPOs API
export const buyerFpoApi = {
  getBuyers: (params) => api.get('/api/buyers', { params }),
  getBuyerById: (id) => api.get(`/api/buyers/${id}`),
  sendBuyerInquiry: (data) => api.post('/api/buyers/inquiry', data),
  getFpos: (params) => api.get('/api/fpos', { params }),
  getFpoById: (id) => api.get(`/api/fpos/${id}`),
  sendFpoInquiry: (data) => api.post('/api/fpos/inquiry', data)
};

// Cold Storage & Rural Logistics API
export const storageLogisticsApi = {
  getStorage: (params) => api.get('/api/storage', { params }),
  bookStorage: (data) => api.post('/api/storage/requests', data),
  getLogistics: (params) => api.get('/api/logistics', { params }),
  bookLogistics: (data) => api.post('/api/logistics/requests', data)
};

// Farm-to-Market Decision Engine & Selling API
export const sellingApi = {
  calculateDecision: (data) => api.post('/api/selling/calculate', data),
  createSellingRequest: (data) => api.post('/api/selling-requests', data),
  getSellingRequests: () => api.get('/api/selling-requests'),
  getRequestById: (id) => api.get(`/api/selling-requests/${id}`),
  updateStatus: (id, status) => api.put(`/api/selling-requests/${id}/status`, { status })
};

// Admin API
export const adminApi = {
  getStats: () => api.get('/api/admin/stats')
};

// AI Advisory & Smart Assistant API
export const aiApi = {
  chat: (data) => api.post('/api/ai/chat', data),
  getTopics: (lang) => api.get('/api/ai/topics', { params: { lang } })
};

export default api;
