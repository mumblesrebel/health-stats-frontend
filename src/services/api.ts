import axios from 'axios'
import { mockApi } from '../mocks/mockApi'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Health record types
export interface HealthRecord {
  id: string
  userId: string
  date: string
  type: string
  value: number
  unit: string
  notes?: string
}

// Use mock API in development if enabled
const apiService = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' ? mockApi : api

// API functions
export const healthApi = {
  // Health records
  getHealthRecords: () => apiService.get<HealthRecord[]>('/health-records'),
  createHealthRecord: (data: Omit<HealthRecord, 'id'>) => 
    apiService.post<HealthRecord>('/health-records', data),
  updateHealthRecord: (id: string, data: Partial<HealthRecord>) =>
    apiService.put<HealthRecord>(`/health-records/${id}`, data),
  deleteHealthRecord: (id: string) => 
    apiService.delete(`/health-records/${id}`),

  // Authentication
  login: (email: string, password: string) =>
    apiService.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    apiService.post('/auth/register', { email, password, name }),
}

export default api
