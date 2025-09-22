const express = require('express');
const { generateContent } = require('../controllers/chatbotController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(auth);

router.post('/generate', generateContent);

module.exports = router;