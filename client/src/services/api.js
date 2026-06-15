import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_HOST ? `https://${import.meta.env.VITE_API_HOST}/api` : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Cars API
export const getCars = (params = {}) => api.get('/cars', { params });

export const searchCars = (query) => api.get('/cars/search', { params: { q: query } });

export const getCarById = (id) => api.get(`/cars/${id}`);

export const compareCars = (ids) => api.get('/cars/compare', { params: { ids: ids.join(',') } });

export const getFilterMeta = () => api.get('/cars/meta/filters');

export const getRecommendations = (preferences) => api.post('/cars/recommend', preferences);

export default api;
