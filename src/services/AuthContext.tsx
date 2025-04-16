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

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('AuthContext: Attempting login...');
      const data = await healthApi.login(email, password);
      
      console.log('AuthContext: Login successful:', data);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error: any) {
      console.error('AuthContext: Login failed:', error.message);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('AuthContext: Starting registration...', { email, name });
      const response = await healthApi.register(email, password, name);
      console.log('AuthContext: Registration response:', {
        status: response?.status,
        data: response?.data
      });

      if (!response?.data) {
        throw new Error('No response data from registration');
      }

      // For now, just log the user in automatically with the registration response
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error: any) {
      console.error('AuthContext: Registration error:', {
        name: error.name,
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response'
      });
      throw new Error(error.response?.data?.message || error.message);
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
