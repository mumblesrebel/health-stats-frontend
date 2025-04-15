import axios from 'axios'
import { mockApi } from '../mocks/mockApi'

const apiUrl = 'https://health-stats-api.onrender.com';
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
  login: (email: string, password: string) =>
    apiService.post('/api/auth/login', { email, password }),
  register: async (email: string, password: string, name: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    const requestData = { email, password, firstName, lastName };
    console.log('API Service: Sending registration request to:', apiUrl + '/api/auth/register');
    console.log('API Service: Request data:', requestData);
    
    try {
      const response = await apiService.post('/api/auth/register', requestData, {
        transformResponse: [(data) => {
          console.log('API Service: Raw response:', data);
          try {
            if (!data) {
              throw new Error('Empty response');
            }
            const parsed = JSON.parse(data);
            console.log('API Service: Parsed response:', parsed);
            if (!parsed.token || !parsed.user) {
              throw new Error('Invalid response format');
            }
            return parsed;
          } catch (e) {
            console.error('API Service: Response parsing error:', e);
            throw e;
          }
        }]
      });

      console.log('API Service: Final response:', response);
      return response;
    } catch (error: any) {
      console.error('API Service: Registration error:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response',
        request: error.request ? 'Request made but no response received' : 'Request setup failed'
      });
      throw error;
    }
  },
}

export default api
