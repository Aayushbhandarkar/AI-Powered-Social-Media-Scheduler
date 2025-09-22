import { useState, useEffect } from 'react'
import api from '../utils/api'

const Settings = () => {
  const [connectedAccounts, setConnectedAccounts] = useState({
    twitter: false,
    linkedin: false,
    instagram: false
  })
  const [loading, setLoading] = useState(true)
  const [aiPreferences, setAiPreferences] = useState({
    tone: 'professional',
    style: 'informative'
  })

  useEffect(() => {
    handleOAuthRedirect()
  }, [])

  const handleOAuthRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const platform = urlParams.get('platform')

    try {
      if (code && platform) {
        window.location.href = `${
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
        }/auth/${platform}/callback?code=${code}`
      } else {
        await fetchConnectedAccounts()
      }
    } catch (error) {
      console.error('OAuth handling failed:', error)
    } finally {
      window.history.replaceState({}, document.title, '/settings')
    }
  }

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/social/accounts')
      setConnectedAccounts(response.data.data)
    } catch (error) {
      console.error('Error fetching connected accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async (platform) => {
    if (!window.confirm(`Are you sure you want to disconnect ${platform}?`)) return
    try {
      await api.delete(`/social/disconnect/${platform}`)
      setConnectedAccounts(prev => ({ ...prev, [platform]: false }))
      alert(`${platform} disconnected successfully.`)
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error)
      alert(`Failed to disconnect ${platform}.`)
    }
  }

  const getOAuthUrl = (platform) => {
    return `${
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
    }/auth/${platform}`
  }

  const handlePreferenceChange = (key, value) => {
    setAiPreferences(prev => ({ ...prev, [key]: value }))
  }

  const savePreferences = () => {
    console.log('Saving AI preferences:', aiPreferences)
    alert('Preferences saved (frontend only)')
  }

  if (loading) return <div className="text-gray-300 p-6">Loading...</div>

  return (
    <div className="space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Connected Accounts */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">Connected Accounts</h2>
        <div className="space-y-4">
          {['twitter', 'linkedin', 'instagram'].map(platform => (
            <div
              key={platform}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold capitalize text-gray-200">
                  {platform[0]}
                </div>
                <div>
                  <h3 className="font-medium capitalize text-white">{platform}</h3>
                  <p className="text-sm text-gray-400">
                    {connectedAccounts[platform] ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>

              {connectedAccounts[platform] ? (
                <button
                  onClick={() => handleDisconnect(platform)}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                >
                  Disconnect
                </button>
              ) : (
                <a
                  href={getOAuthUrl(platform)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                >
                  Connect
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Preferences */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">AI Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content Tone
            </label>
            <select
              value={aiPreferences.tone}
              onChange={(e) => handlePreferenceChange('tone', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content Style
            </label>
            <select
              value={aiPreferences.style}
              onChange={(e) => handlePreferenceChange('style', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="informative">Informative</option>
              <option value="persuasive">Persuasive</option>
              <option value="entertaining">Entertaining</option>
              <option value="inspirational">Inspirational</option>
            </select>
          </div>

          <button
            onClick={savePreferences}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium shadow-md transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
