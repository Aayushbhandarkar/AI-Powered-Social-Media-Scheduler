const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const connectDB = require('./config/db');
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const socialRoutes = require('./routes/socialRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const errorHandler = require('./middlewares/errorHandler');
require('./scripts/scheduler');

const app = express();

connectDB();

// FIXED CORS - allow your frontend URL
app.use(cors({
  origin: 'https://ai-powered-social-media-scheduler.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test endpoint working' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
