import axios from 'axios'
import { mockApi } from '../mocks/mockApi'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log('API Service: Using API URL:', apiUrl);

const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')

const api = axios.create({
  baseURL: apiUrl,
  timeout: apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept'
  },
  withCredentials: false
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
  getCurrentUser: () => apiService.get('/api/auth/me'),
  login: (email: string, password: string) =>
    apiService.post('/api/auth/login', { email, password }),
  register: async (email: string, password: string, name: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    const requestData = { email, password, firstName, lastName };
    
    try {
      console.log('API Service: Sending registration request:', {
        url: apiUrl + '/api/auth/register',
        data: requestData
      });
      
      const response = await apiService.post('/api/auth/register', requestData);
      
      console.log('API Service: Full registration response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        config: response.config
      });
      
      if (!response.data) {
        console.error('API Service: No response data');
        throw new Error('No response data from server');
      }

      console.log('API Service: Response data type:', typeof response.data);
      console.log('API Service: Response data keys:', Object.keys(response.data));
      
      if (!response.data.token) {
        console.error('API Service: Missing token in response');
        throw new Error('Missing token in response');
      }
      
      if (!response.data.user) {
        console.error('API Service: Missing user in response');
        throw new Error('Missing user in response');
      }
      
      return response;
    } catch (error: any) {
      console.error('API Service: Registration error:', {
        name: error.name,
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data
        } : 'No response',
        request: error.request ? 'Request made but no response received' : 'Request setup failed'
      });
      throw error;
    }
  },
}

export default api
