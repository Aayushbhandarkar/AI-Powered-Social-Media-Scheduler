import axios from 'axios'

// Use direct URL - no environment detection
const API_BASE_URL = 'https://ai-powered-social-media-scheduler-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Making API request to:', config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message)
    console.error('Full error:', error)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error('Cannot connect to backend at:', API_BASE_URL)
    }
    
    return Promise.reject(error)
  }
)

export default api
