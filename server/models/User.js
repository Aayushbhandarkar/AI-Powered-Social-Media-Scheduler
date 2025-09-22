// filename: models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true, // allows users who only sign up via OAuth without email
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || validator.isEmail(v);
        },
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      select: false, // prevents returning password hash by default
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-zA-Z0-9._-]+$/, // allow safe usernames only
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // OAuth IDs
    twitterId: { type: String, index: true },
    linkedinId: { type: String, index: true },
    instagramId: { type: String, index: true },

    // OAuth tokens and profiles
    twitter: {
      token: String,
      tokenSecret: String,
      profile: Object,
    },
    linkedin: {
      token: String,
      refreshToken: String,
      profile: Object,
    },
    instagram: {
      token: String,
      refreshToken: String,
      profile: Object,
    },

    // AI settings
    aiPreferences: {
      tone: {
        type: String,
        default: 'professional',
        enum: ['professional', 'casual', 'friendly', 'informative'], // limited values
      },
      contentStyle: {
        type: String,
        default: 'informative',
        enum: ['informative', 'persuasive', 'creative', 'concise'],
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // in case user signed up via OAuth only
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
