// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient } from '../services/api'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  weightClass?: string
  federation?: string
  experienceLevel: string
  subscriptionStatus: string
  subscriptionExpiry?: string
  trialExpiry?: string
  preferredUnits: string
  profileComplete: number
  hasActiveSubscription: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
  checkSubscriptionStatus: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('token')
      if (token) {
        try {
          // Add timeout to prevent hanging
          const response = await Promise.race([
            apiClient.get('/auth/me'),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), 3000)
            )
          ]) as any
          setUser(response.data.data.user)
        } catch (error) {
          // Token is invalid or server unavailable, remove it
          Cookies.remove('token')
          console.warn('Failed to authenticate user (server may be offline):', error)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      console.log('Full server response:', response.data) // Add this line
      
      const { token, data } = response.data
      console.log('Extracted token:', token) // Add this line
      console.log('Extracted data:', data) // Add this line
      
      // Store token in cookies
      Cookies.set('token', token, { expires: 7 }) // 7 days
      
      setUser(data.user)
      toast.success('Welcome back!')
    } catch (error: any) {
      // error handling...
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const response = await apiClient.post('/auth/register', registerData)
      const { token, data } = response.data
      
      // Store token in cookies
      Cookies.set('token', token, { expires: 7 }) // 7 days
      
      setUser(data.user)
      toast.success('Welcome to Powerlifting Tracker! Your 14-day trial has started.')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.get('/auth/me')
      setUser(response.data.data.user)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }

  const checkSubscriptionStatus = async () => {
    try {
      const response = await apiClient.get('/subscription/status')
      const subscriptionData = response.data.data
      
      if (user) {
        setUser({
          ...user,
          subscriptionStatus: subscriptionData.subscriptionStatus,
          subscriptionExpiry: subscriptionData.subscriptionExpiry,
          trialExpiry: subscriptionData.trialExpiry,
          hasActiveSubscription: subscriptionData.hasActiveSubscription,
        })
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    checkSubscriptionStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext