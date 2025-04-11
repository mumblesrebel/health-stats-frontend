import { mockHealthRecords, mockUser } from './data'
import { AxiosInstance, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

interface HealthRecord {
  id: string
  userId: string
  date: string
  type: string
  value: number
  unit: string
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

const createResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: {}
  } as InternalAxiosRequestConfig
})

export const mockApi: Pick<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> = {
  get: async <T = any, R = AxiosResponse<T>>(url: string, _config?: AxiosRequestConfig): Promise<R> => {
    await delay(500)
    if (url === '/health-records') {
      return createResponse<T>(mockHealthRecords as unknown as T) as R
    }
    throw new Error('Not found')
  },

  post: async <T = any, R = AxiosResponse<T>>(url: string, data?: any, _config?: AxiosRequestConfig): Promise<R> => {
    await delay(500)
    if (url === '/auth/login' && data && typeof data === 'object') {
      const { email, password } = data as { email: string; password: string }
      if (email === mockUser.email && password === 'password') {
        return createResponse<T>({
          token: 'mock-token',
          user: mockUser
        } as unknown as T) as R
      }
      throw new Error('Invalid credentials')
    }

    if (url === '/auth/register' && data && typeof data === 'object') {
      const { email, name } = data as { email: string; name: string }
      return createResponse<T>({
        token: 'mock-token',
        user: { ...mockUser, email, name }
      } as unknown as T) as R
    }

    if (url === '/health-records' && data && typeof data === 'object') {
      const newRecord: HealthRecord = {
        id: Date.now().toString(),
        userId: mockUser.id,
        date: new Date().toISOString(),
        ...data as Omit<HealthRecord, 'id' | 'userId' | 'date'>
      }
      mockHealthRecords.push(newRecord)
      return createResponse<T>(newRecord as unknown as T) as R
    }

    throw new Error('Not found')
  },

  put: async <T = any, R = AxiosResponse<T>>(url: string, data?: any, _config?: AxiosRequestConfig): Promise<R> => {
    await delay(500)
    const match = url.match(/\/health-records\/(.+)/)
    if (match && data && typeof data === 'object') {
      const id = match[1]
      const index = mockHealthRecords.findIndex(record => record.id === id)
      if (index === -1) {
        throw new Error('Record not found')
      }
      mockHealthRecords[index] = { ...mockHealthRecords[index], ...data as Partial<HealthRecord> }
      return createResponse<T>(mockHealthRecords[index] as unknown as T) as R
    }
    throw new Error('Not found')
  },

  delete: async <T = any, R = AxiosResponse<T>>(url: string, _config?: AxiosRequestConfig): Promise<R> => {
    await delay(500)
    const match = url.match(/\/health-records\/(.+)/)
    if (match) {
      const id = match[1]
      const index = mockHealthRecords.findIndex(record => record.id === id)
      if (index === -1) {
        throw new Error('Record not found')
      }
      mockHealthRecords.splice(index, 1)
      return createResponse<T>(null as unknown as T) as R
    }
    throw new Error('Not found')
  }
}
