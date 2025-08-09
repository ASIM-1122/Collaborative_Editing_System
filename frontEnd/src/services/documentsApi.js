// src/services/documentApi.js
import axios from 'axios';

const documentApi = axios.create({
  baseURL: 'http://localhost:3000', // Document microservice
  withCredentials: true,
});

// ✅ Automatically inject Bearer token from localStorage
documentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or use cookie here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default documentApi;
