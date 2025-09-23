import axios from 'axios'

// Direct URL - remove environment detection to avoid issues
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
    
    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    if (!error.response) {
      console.error('Network error - Backend might be unavailable')
      // Show user-friendly error message
      alert('Cannot connect to server. Please check your connection and try again.')
    }
    
    return Promise.reject(error)
  }
)

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/health')
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: `Cannot connect to backend at ${API_BASE_URL}`,
      details: error.message 
    }
  }
}

export default api
