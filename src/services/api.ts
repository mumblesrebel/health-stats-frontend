import axios from 'axios'
import { mockApi } from '../mocks/mockApi'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log('API Service: Using API URL:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')
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
      
      const response = await apiService.post('/api/auth/register', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        transformResponse: [(data) => {
          console.log('API Service: Raw response data:', data);
          try {
            if (!data) {
              console.error('API Service: Empty response data');
              return null;
            }
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            console.log('API Service: Parsed response data:', parsed);
            return parsed;
          } catch (e) {
            console.error('API Service: Failed to parse response:', e);
            return data;
          }
        }]
      });
      
      console.log('API Service: Final response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      // Check if we got a valid response
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Registration failed with status ${response.status}`);
      }
      
      if (!response.data || !response.data.token || !response.data.user) {
        console.error('API Service: Invalid response structure:', response.data);
        throw new Error('Invalid response structure from server');
      }
      
      return response;
    } catch (error: any) {
      console.error('API Service: Registration error:', {
        name: error.name,
        message: error.message,
        config: error.config,
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
