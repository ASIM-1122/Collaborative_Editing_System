// utils/api.js
import axios from 'axios'

const USER_SERVICE_BASE = import.meta.env.VITE_USER_SERVICE_BASE || 'http://localhost:5000'
const DOCUMENT_SERVICE_BASE = import.meta.env.VITE_DOCUMENT_SERVICE_BASE || 'http://localhost:3000'
const VERSION_SERVICE_BASE = import.meta.env.VITE_VERSION_SERVICE_BASE || 'http://localhost:4000'

// Helper function to create axios instances with token
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  })

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  return instance
}

// Export instances for each service
export const userApi = createAxiosInstance(USER_SERVICE_BASE)
export const documentApi = createAxiosInstance(DOCUMENT_SERVICE_BASE)
export const versionApi = createAxiosInstance(VERSION_SERVICE_BASE)
