// filename: routes/socialRoutes.js
const express = require('express');
const {
  getConnectedAccounts,
  disconnectAccount,
} = require('../controllers/socialController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

// ---------------- Protected Routes ----------------
// All routes require authentication
router.use(auth);

// Get all connected social accounts
router.get('/accounts', getConnectedAccounts);

// Disconnect a social account by platform (twitter, linkedin, instagram)
router.delete('/disconnect/:platform', disconnectAccount);

module.exports = router;
