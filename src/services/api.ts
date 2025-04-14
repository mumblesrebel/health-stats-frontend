import axios from 'axios'
import { mockApi } from '../mocks/mockApi'

const apiUrl = import.meta.env.VITE_API_URL || '/api';
console.log('API Service: Using API URL:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
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
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response interceptor error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    })
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
  getHealthRecords: () => apiService.get<HealthRecord[]>('/api/health-records'),
  createHealthRecord: (data: Omit<HealthRecord, 'id'>) => 
    apiService.post<HealthRecord>('/api/health-records', data),
  updateHealthRecord: (id: string, data: Partial<HealthRecord>) =>
    apiService.put<HealthRecord>(`/api/health-records/${id}`, data),
  deleteHealthRecord: (id: string) => 
    apiService.delete(`/api/health-records/${id}`),

  // Authentication
  login: (email: string, password: string) =>
    apiService.post('/api/auth/login', { email, password }),
  register: async (email: string, password: string, name: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    console.log('Sending registration request:', { email, firstName, lastName });
    try {
      const response = await apiService.post('/api/auth/register', { email, password, firstName, lastName });
      console.log('Registration response:', response);
      return response;
    } catch (error: any) {
      console.error('Registration error:', error.response || error);
      throw error;
    }
  },
}

export default api
