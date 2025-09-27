import axios from 'axios'

// Use direct URL - no environment detection
const API_BASE_URL = 'https://ai-powered-social-media-scheduler-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased to 30 seconds for AI processing
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 Request with token to:', config.url)
    } else {
      console.log('⚠️ Request without token to:', config.url)
    }
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Handle responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received from:', response.config.url, 'Status:', response.status)
    return response
  },
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      console.warn('🔐 Authentication failed - redirecting to login')
      localStorage.removeItem('token')
      // Don't redirect immediately - let component handle it
      // window.location.href = '/login'
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error('🌐 Network error - cannot connect to backend at:', API_BASE_URL)
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - server took too long to respond')
    }
    
    return Promise.reject(error)
  }
)

export default api
