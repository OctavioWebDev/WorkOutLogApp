import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here when available
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient
