import { useState } from 'react'
import { format } from 'date-fns'
import api from '../utils/api'

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content.text)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdate = async () => {
  if (!editedContent.trim()) return
  setIsSubmitting(true)
  try {
    await api.put(`/posts/${post._id}`, {
      content: { ...post.content, text: editedContent }
    })
    setIsEditing(false)
    onUpdate()
  } catch (error) {
    console.error('Error updating post:', error)
  } finally {
    setIsSubmitting(false)
  }
}

const handleDelete = async () => {
  if (window.confirm('Are you sure you want to delete this post?')) {
    try {
      await api.delete(`/posts/${post._id}`)
      onDelete()
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }
}


  return (
    <div className="bg-dark-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="input-field w-full h-24"
            placeholder="Edit your post content..."
          />
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setEditedContent(post.content.text) // reset on cancel
              }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Post Content */}
          <p className="text-gray-200">{post.content.text}</p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary-600 px-2 py-1 rounded text-white">
                {format(new Date(post.scheduledDate), 'MMM d, yyyy h:mm a')}
              </span>
              <span className="bg-dark-400 px-2 py-1 rounded">
                {post.platforms.join(', ') || 'No platforms'}
              </span>
              <span
                className={`px-2 py-1 rounded ${
                  post.status === 'published'
                    ? 'bg-green-600 text-white'
                    : post.status === 'scheduled'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-red-600 text-white'
                }`}
              >
                {post.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard
