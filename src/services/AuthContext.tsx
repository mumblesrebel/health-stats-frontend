import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { healthApi } from './api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthResponse {
  token: string
  user: User
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
          const data = response.data as AuthResponse
          if (data?.user) {
            setUser(data.user)
          } else {
            throw new Error('Invalid user data')
          }
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
      const response = await healthApi.login(email, password);
      
      console.log('AuthContext: Login response:', response);
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response format');
      }
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      console.log('AuthContext: Login successful');
    } catch (error: any) {
      console.error('AuthContext: Login failed:', error.message);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('AuthContext: Starting registration...');
      const response = await healthApi.register(email, password, name);
      
      console.log('AuthContext: Registration response:', response);
      if (!response.token || !response.user) {
        throw new Error('Invalid registration response format');
      }
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      console.log('AuthContext: Registration successful');
    } catch (error: any) {
      console.error('AuthContext: Registration failed:', error.message);
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
