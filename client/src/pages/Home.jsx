import { useState, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import api from '../utils/api'
import PostCard from '../components/PostCard'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPost, setNewPost] = useState({
    content: { text: '', media: '' },
    platforms: [],
    scheduledDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setErrorMsg('Failed to load posts.')
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    
    if (newPost.platforms.length === 0) {
      setErrorMsg('Please select at least one platform.')
      return
    }

    if (!newPost.content.text.trim()) {
      setErrorMsg('Post content cannot be empty.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const postData = {
        ...newPost,
        scheduledDate: new Date(newPost.scheduledDate).toISOString()
      }

      await api.post('/posts', postData)
      setShowCreateModal(false)
      setNewPost({ content: { text: '', media: '' }, platforms: [], scheduledDate: '' })
      fetchPosts()
    } catch (error) {
      console.error('Error creating post:', error)
      setErrorMsg(error.response?.data?.error || 'Failed to create post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const upcomingPosts = posts
    .filter(post => new Date(post.scheduledDate) > new Date())
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-md">
          📊 Dashboard
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-5 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-indigo-600/40 transition-all duration-300"
        >
          <HiPlus className="w-5 h-5" />
          <span>Schedule Post</span>
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl shadow-md">
          {errorMsg}
        </div>
      )}

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Posts */}
        <div className="bg-[#0d111a]/90 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-5 text-white flex items-center gap-2">
            ⏳ Upcoming Posts
          </h2>
          {upcomingPosts.length === 0 ? (
            <p className="text-gray-400">No upcoming posts scheduled.</p>
          ) : (
            <div className="space-y-4">
              {upcomingPosts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUpdate={fetchPosts}
                  onDelete={fetchPosts}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-[#0d111a]/90 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-5 text-white flex items-center gap-2">
            ⚡ Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#1a1f2e] rounded-xl p-5 text-center shadow hover:shadow-indigo-600/30 transition-all duration-300">
              <div className="text-3xl font-bold text-indigo-500">{posts.length}</div>
              <div className="text-gray-400 mt-1">Total Posts</div>
            </div>
            <div className="bg-[#1a1f2e] rounded-xl p-5 text-center shadow hover:shadow-green-600/30 transition-all duration-300">
              <div className="text-3xl font-bold text-green-500">
                {posts.filter(p => p.status === 'published').length}
              </div>
              <div className="text-gray-400 mt-1">Published</div>
            </div>
            <div className="bg-[#1a1f2e] rounded-xl p-5 text-center shadow hover:shadow-yellow-600/30 transition-all duration-300">
              <div className="text-3xl font-bold text-yellow-500">
                {posts.filter(p => p.status === 'scheduled').length}
              </div>
              <div className="text-gray-400 mt-1">Scheduled</div>
            </div>
            <div className="bg-[#1a1f2e] rounded-xl p-5 text-center shadow hover:shadow-red-600/30 transition-all duration-300">
              <div className="text-3xl font-bold text-red-500">
                {posts.filter(p => p.status === 'failed').length}
              </div>
              <div className="text-gray-400 mt-1">Failed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#0d111a] border border-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-semibold mb-6 text-white">📝 Schedule New Post</h3>
            
            <form onSubmit={handleCreatePost} className="space-y-5">
              {/* Post Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={newPost.content.text}
                  onChange={(e) => setNewPost({
                    ...newPost,
                    content: { ...newPost.content, text: e.target.value }
                  })}
                  className="w-full h-28 px-4 py-3 rounded-xl border border-gray-700 bg-[#1a1f2e] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="What would you like to post?"
                  required
                />
              </div>
              
              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platforms
                </label>
                <div className="flex space-x-6">
                  {['twitter', 'linkedin', 'instagram'].map(platform => (
                    <label key={platform} className="flex items-center text-gray-300 space-x-2">
                      <input
                        type="checkbox"
                        checked={newPost.platforms.includes(platform)}
                        onChange={(e) => {
                          const platforms = e.target.checked
                            ? [...newPost.platforms, platform]
                            : newPost.platforms.filter(p => p !== platform)
                          setNewPost({ ...newPost, platforms })
                        }}
                        className="rounded border-gray-600 bg-[#1a1f2e] text-blue-500 focus:ring-blue-600"
                      />
                      <span className="capitalize">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Date Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost({
                    ...newPost,
                    scheduledDate: e.target.value
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#1a1f2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              {/* Buttons */}
              <div className="flex space-x-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-600/40 transition-all duration-300"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
