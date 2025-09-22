import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'
import { TypeAnimation } from 'react-type-animation'

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await register(
      formData.email,
      formData.password,
      formData.username
    )

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 px-6">
      <div className="flex w-full max-w-6xl h-[720px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl bg-[#0a0a0f]/95 border border-gray-800">
        
        {/* Left Section (Branding with Typing Effect) */}
        <div className="w-1/2 bg-[#05070f] flex items-center justify-center relative rounded-l-3xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-blue-800/10 rounded-l-3xl" />
          <div className="relative text-center px-6">
            <h1 className="text-5xl font-extrabold text-white mb-6 leading-snug drop-shadow-xl">
              <TypeAnimation
                sequence={[
                  'AI-powered',
                  1200,
                  'AI-powered Social',
                  1200,
                  'AI-powered Social Media',
                  1200,
                  'AI-powered Social Media Platform',
                  2000,
                ]}
                wrapper="span"
                speed={60}
                repeat={Infinity}
              />
            </h1>
            <p className="mt-4 text-gray-400 tracking-wide text-lg font-medium">
              Create, schedule, and publish your content seamlessly with AI.
            </p>
          </div>
        </div>

        {/* Right Section (Signup Form) */}
        <div className="w-1/2 bg-[#0d111a]/95 p-14 flex flex-col justify-center backdrop-blur-md rounded-r-3xl">
          <h2 className="text-3xl font-bold text-white mb-3">Create your account 🚀</h2>
          <p className="text-sm text-gray-500 mb-10">
            Join us and explore the future of social media.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#1a1f2e]/90 border border-gray-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300"
                placeholder="Username"
              />
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1a1f2e]/90 border border-gray-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300"
                placeholder="Email Address"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#1a1f2e]/90 border border-gray-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300"
                placeholder="Password"
              />
            </div>

            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#1a1f2e]/90 border border-gray-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300"
                placeholder="Confirm Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-600/40 transition-all duration-300"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Login
              </Link>
            </p>
          </form>

          {/* Social Signup */}
          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/60" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[#0d111a]/95 text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <a
                href="/api/auth/twitter"
                className="bg-[#1a1f2e]/90 hover:bg-[#242a3a] text-gray-200 py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-blue-600/30"
              >
                Twitter
              </a>
              <a
                href="/api/auth/linkedin"
                className="bg-[#1a1f2e]/90 hover:bg-[#242a3a] text-gray-200 py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-blue-600/30"
              >
                LinkedIn
              </a>
              <a
                href="/api/auth/instagram"
                className="bg-[#1a1f2e]/90 hover:bg-[#242a3a] text-gray-200 py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-blue-600/30"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
