// filename: models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // faster lookups for all user posts
    },
    content: {
      text: {
        type: String,
        required: true,
        trim: true, // prevent leading/trailing spaces
        maxlength: 5000, // safe limit for large posts (adjust as needed)
      },
      media: {
        type: String, // URL to image/video
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: 'Media must be a valid URL starting with http:// or https://',
        },
      },
    },
    platforms: [
      {
        type: String,
        enum: ['twitter', 'linkedin', 'instagram'],
        required: true,
      },
    ],
    scheduledDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v instanceof Date && v > Date.now();
        },
        message: 'Scheduled date must be in the future',
      },
    },
    status: {
      type: String,
      enum: ['scheduled', 'published', 'failed'],
      default: 'scheduled',
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
      trim: true,
    },

    // AI generation context
    aiContext: {
      prompt: {
        type: String,
        trim: true,
      },
      response: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Compound indexes for efficient queries
postSchema.index({ userId: 1, scheduledDate: 1 });
postSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.model('Post', postSchema);
