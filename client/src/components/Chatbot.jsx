import { useState, useRef, useEffect } from 'react'
import api from '../utils/api'

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Test the chatbot endpoint on component mount
  useEffect(() => {
    const testChatbotEndpoint = async () => {
      try {
        console.log('🔍 Testing chatbot endpoint and authentication...')
        
        const token = localStorage.getItem('token')
        console.log('🔐 Token exists:', !!token)
        
        // Test if backend is accessible
        const healthResponse = await fetch('https://ai-powered-social-media-scheduler-backend.onrender.com/api/health')
        console.log('🏥 Health check status:', healthResponse.status)
        
        // Test chatbot endpoint directly
        const testResponse = await fetch('https://ai-powered-social-media-scheduler-backend.onrender.com/api/chatbot/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            prompt: 'Test connection',
            platform: 'general',
            tone: 'friendly'
          })
        })
        
        console.log('🔍 Chatbot test status:', testResponse.status)
        
        if (testResponse.status === 401) {
          console.warn('⚠️ Authentication required - user needs to login')
        } else if (testResponse.ok) {
          const testData = await testResponse.json()
          console.log('✅ Chatbot test successful:', testData)
        }
        
      } catch (error) {
        console.error('🔍 Test failed:', error.message)
      }
    }

    testChatbotEndpoint()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      console.log('📤 Sending message to chatbot...', {
        prompt: input,
        contextLength: messages.slice(-10).length,
        hasToken: !!localStorage.getItem('token')
      })

      const response = await api.post('/chatbot/generate', {
        prompt: input,
        context: messages.slice(-10),
        platform: 'general', // Add platform explicitly
        tone: 'engaging'     // Add tone explicitly
      })

      console.log('✅ API Response received:', {
        status: response.status,
        success: response.data.success,
        hasData: !!response.data.data,
        response: response.data.data?.response?.substring(0, 100) + '...'
      })

      // Check response structure more carefully
      if (response.data && response.data.success && response.data.data && response.data.data.response) {
        const aiMessage = {
          role: 'assistant',
          content: response.data.data.response,
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        console.error('❌ Invalid response structure:', response.data)
        throw new Error('Invalid response format from server')
      }

    } catch (error) {
      console.error('❌ Detailed error information:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestUrl: error.config?.url
      })

      let errorContent = '⚠️ Oops! Something went wrong. Try again.'
      
      // More specific error messages
      if (error.response?.status === 401) {
        errorContent = '🔐 Please log in to use the AI assistant.'
      } else if (error.response?.status === 500) {
        errorContent = '🚨 Server error. The AI service might be down.'
      } else if (error.response?.status === 404) {
        errorContent = '🌐 Endpoint not found. Please check the configuration.'
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorContent = '📡 Network error. Please check your connection.'
      } else if (error.response?.data?.error) {
        errorContent = `⚠️ ${error.response.data.error}`
      } else if (error.message.includes('timeout')) {
        errorContent = '⏰ Request timeout. The server is taking too long to respond.'
      }

      const errorMessage = {
        role: 'assistant',
        content: errorContent,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-xl h-full flex flex-col border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">💡 AI Content Assistant</h2>
        {!isAuthenticated && (
          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">Login Required</span>
        )}
      </div>

      {/* Authentication Warning */}
      {!isAuthenticated && (
        <div className="mb-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-yellow-200 text-sm">
            🔐 Please log in to use the AI assistant. The chatbot requires authentication.
          </p>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-10 italic">
            <p>👋 Hi! I can help you craft social media posts, captions, or ideas.</p>
            <p className="mt-1">Just type your request below and hit <span className="font-medium text-blue-400">Send</span>.</p>
            {!isAuthenticated && (
              <p className="mt-2 text-yellow-400 text-sm">
                🔐 You need to be logged in to use this feature.
              </p>
            )}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-100 rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></div>
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-3 border-t border-gray-700 pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isAuthenticated ? "Write your message..." : "Please log in to chat..."}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          disabled={loading || !isAuthenticated}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim() || !isAuthenticated}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md"
        >
          {!isAuthenticated ? 'Login Required' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default Chatbot
