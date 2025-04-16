import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { healthApi } from './api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await healthApi.getCurrentUser()
          setUser(response.data)
        } catch (error) {
          console.error('Token validation failed:', error)
          localStorage.removeItem('token')
          setUser(null)
        }
      }
      setLoading(false)
    }

    validateToken()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await healthApi.login(email, password)
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      // Registration attempt
      console.log('AuthContext: Starting registration...', { email, name });
      const registerResponse = await healthApi.register(email, password, name);
      console.log('AuthContext: Register response status:', registerResponse?.status);
      console.log('AuthContext: Register response data:', registerResponse?.data);
      
      // Wait a moment to ensure the backend has processed the registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Login attempt
      console.log('AuthContext: Attempting login...', { email });
      try {
        const loginResponse = await healthApi.login(email, password);
        console.log('AuthContext: Login response status:', loginResponse?.status);
        console.log('AuthContext: Login response data:', loginResponse?.data);
        
        if (loginResponse?.data?.token) {
          console.log('AuthContext: Setting token and user...');
          localStorage.setItem('token', loginResponse.data.token);
          setUser(loginResponse.data.user);
        } else {
          console.error('AuthContext: Login response missing token:', loginResponse);
          throw new Error('Login response missing token');
        }
      } catch (loginError: any) {
        console.error('AuthContext: Login failed:', {
          status: loginError.response?.status,
          data: loginError.response?.data,
          message: loginError.message
        });
        throw new Error(`Login failed: ${loginError.response?.data?.error || loginError.message}`);
      }
    } catch (error: any) {
      console.error('AuthContext: Registration/Login error:', {
        name: error.name,
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response',
        stack: error.stack
      });
      throw error;
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
