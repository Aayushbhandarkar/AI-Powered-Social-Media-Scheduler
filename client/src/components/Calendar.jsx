import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import api from '../utils/api'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [currentDate])

  const fetchPosts = async () => {
    try {
      // ✅ Fix: no need to write /api here, baseURL already has it
      const response = await api.get('/posts')
      // ✅ check if backend returns {data: [...]} or just [...]
      setPosts(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getPostsForDate = (date) => {
    return posts.filter(post => 
      isSameDay(new Date(post.scheduledDate), date)
    )
  }

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Content Calendar</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={previousMonth} 
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
          >
            Previous
          </button>
          <span className="text-lg font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button 
            onClick={nextMonth} 
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const dayPosts = getPostsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 p-2 border rounded-lg ${
                isCurrentMonth 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-900 border-gray-800 text-gray-500'
              }`}
            >
              <div className="text-sm mb-2">
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayPosts.slice(0, 3).map(post => (
                  <div
                    key={post._id}
                    onClick={() => {
                      setSelectedPost(post)
                      setShowModal(true)
                    }}
                    className="text-xs p-1 bg-indigo-600 rounded cursor-pointer hover:bg-indigo-700 truncate"
                  >
                    {post.content.text}
                  </div>
                ))}
                
                {dayPosts.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{dayPosts.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Scheduled Post</h3>
            <p className="text-gray-300 mb-4">{selectedPost.content.text}</p>
            <p className="text-sm text-gray-400 mb-2">
              Platforms: {selectedPost.platforms.join(', ')}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Scheduled for: {format(new Date(selectedPost.scheduledDate), 'PPP p')}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
