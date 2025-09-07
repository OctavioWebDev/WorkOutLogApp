import axios from 'axios'
import Cookies from 'js-cookie'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = Cookies.get('token')
    console.log('Request interceptor - URL:', config.url)
    console.log('Request interceptor - Token exists:', !!token)
    console.log('Request interceptor - Token value:', token ? token.substring(0, 20) + '...' : 'none')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Response interceptor - Error status:', error.response?.status)
    console.log('Response interceptor - Current path:', window.location.pathname)
    
    // If 401, remove invalid token and redirect to login
    if (error.response?.status === 401) {
      Cookies.remove('token')
      // Only redirect if not already on auth pages AND not during initial dashboard load
      const currentPath = window.location.pathname
      if (!currentPath.includes('/login') && 
          !currentPath.includes('/register') && 
          !currentPath.includes('/')) {
        // Add delay to prevent immediate redirect during dashboard mount
        setTimeout(() => {
          console.log('Redirecting to login due to 401')
          window.location.href = '/login'
        }, 2000) // 2 second delay
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient