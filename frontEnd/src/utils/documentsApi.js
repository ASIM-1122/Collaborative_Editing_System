
import axios from 'axios'

const API_BASE = import.meta.env.VITE_DOCUMENT_API_BASE || 'http://localhost:3000/api'

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default axiosInstance