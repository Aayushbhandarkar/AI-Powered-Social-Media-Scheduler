// Temporary fix - add this to your chatbotRoutes.js
const express = require('express');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Temporary simple route for testing
router.post('/generate', auth, (req, res) => {
  console.log('✅ Chatbot route working - import issue fixed');
  res.json({
    success: true,
    data: {
      response: "This is a test response. Your chatbot route is working!",
      prompt: req.body.prompt,
      platform: "test",
      tone: "friendly"
    }
  });
});

// router.get('/health', (req, res) => {
//   res.json({ status: 'healthy', message: 'Chatbot routes working' });
// });

module.exports = router;
