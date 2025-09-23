import axios from 'axios'

// Smart API URL detection - no .env files needed
const getAPIBaseURL = () => {
  // If we're in production (deployed on Render)
  if (import.meta.env.PROD) {
    return 'https://ai-powered-social-media-scheduler-backend.onrender.com/api'
  }
  // If we're in development
  return '/api' // This will be proxied to your backend in dev
}

const API_BASE_URL = getAPIBaseURL()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token expiration and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    // Enhanced error logging for debugging
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error('Network error - Backend might be unavailable at:', API_BASE_URL)
      console.error('Full error details:', error)
    }
    
    return Promise.reject(error)
  }
)

// Optional: Add a test function to verify backend connectivity
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/health') // or any simple endpoint
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
