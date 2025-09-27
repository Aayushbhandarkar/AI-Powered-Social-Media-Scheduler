const express = require('express');
const { generateContent, healthCheck } = require('../controllers/chatController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply auth to all routes except health check
router.use(auth);
router.post('/generate', generateContent);
router.get('/health', healthCheck); // Add health check endpoint

module.exports = router;
