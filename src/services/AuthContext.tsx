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
      console.log('AuthContext: Starting registration...');
      const registerResponse = await healthApi.register(email, password, name);
      console.log('AuthContext: Got register response:', registerResponse);
      
      // After registration, try to log in with the same credentials
      console.log('AuthContext: Attempting login after registration...');
      const loginResponse = await healthApi.login(email, password);
      console.log('AuthContext: Got login response:', loginResponse);
      
      if (loginResponse?.data?.token) {
        console.log('AuthContext: Setting token and user...');
        localStorage.setItem('token', loginResponse.data.token);
        setUser(loginResponse.data.user);
      } else {
        console.error('AuthContext: Invalid login response structure:', loginResponse);
        throw new Error('Login failed after registration');
      }
    } catch (error: any) {
      console.error('AuthContext: Registration/Login error:', {
        error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
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
