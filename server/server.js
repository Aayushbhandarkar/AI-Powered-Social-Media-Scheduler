const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Load env vars
dotenv.config();

// Import config
const connectDB = require('./config/db');
require('./config/passport');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const socialRoutes = require('./routes/socialRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

// Import scheduler
require('./scripts/scheduler');

const app = express();

// Connect to database
connectDB();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Middleware
app.use(cors({
  origin: 'https://ai-powered-social-media-scheduler.onrender.com' || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production - COMPLETELY REMOVED PROBLEMATIC ROUTES
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // SIMPLE CATCH-ALL THAT WORKS: Serve index.html for any GET request that's not an API route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// SIMPLE 404 handler that works
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      success: false,
      error: 'API route not found'
    });
  } else if (process.env.NODE_ENV === 'production') {
    // For non-API routes in production, serve the React app
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  } else {
    res.status(404).send('Route not found');
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
