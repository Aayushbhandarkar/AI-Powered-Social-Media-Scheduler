// filename: routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  getMe,
} = require('../controllers/authController');
const { auth, generateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// ---------------- Local Auth ----------------
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

// ---------------- Twitter OAuth ----------------
router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
    }

    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// ---------------- LinkedIn OAuth ----------------
router.get('/linkedin', passport.authenticate('linkedin'));

router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
    }

    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// ---------------- Instagram OAuth ----------------
router.get('/instagram', passport.authenticate('instagram'));

router.get(
  '/instagram/callback',
  passport.authenticate('instagram', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
    }

    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

module.exports = router;
