import { createContext, useContext, useState, useEffect } from 'react'
import api from './api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    // If token exists, fetch user
    if (token) {
      getUser()
    } else {
      handleOAuthRedirect()
    }
  }, [])

  // Handle OAuth redirects (Twitter, LinkedIn, Instagram)
  const handleOAuthRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token') // Backend redirect with JWT

    try {
      if (tokenFromUrl) {
        // Store token and fetch user
        localStorage.setItem('token', tokenFromUrl)
        await getUser()
      }
    } catch (error) {
      console.error('OAuth login failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
      // Clean URL to remove query params
      window.history.replaceState({}, document.title, '/')
    }
  }

  const getUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to get user:', error)
      localStorage.removeItem('token')
      window.location.href = '/login' // redirect if token invalid
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  }

  const register = async (email, password, username) => {
    try {
      const response = await api.post('/auth/register', { email, password, username })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
