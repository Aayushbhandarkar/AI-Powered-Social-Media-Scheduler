const express = require('express');
const { generateContent, healthCheck } = require('../controllers/chatController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(auth);
router.post('/generate', generateContent);
router.get('/health', healthCheck);

module.exports = router;
