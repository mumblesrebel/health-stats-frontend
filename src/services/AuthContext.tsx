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
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      // TODO: Implement token validation
      setLoading(false)
    } else {
      setLoading(false)
    }
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
      const response = await healthApi.register(email, password, name);
      console.log('AuthContext: Got response:', response);
      
      if (response?.data?.token) {
        console.log('AuthContext: Setting token and user...');
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
      } else {
        console.error('AuthContext: Invalid response structure:', response);
        throw new Error(`Server response missing token: ${JSON.stringify(response?.data)}`);
      }
    } catch (error: any) {
      console.error('AuthContext: Registration error:', {
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
