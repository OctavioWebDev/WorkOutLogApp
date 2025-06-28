import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
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
