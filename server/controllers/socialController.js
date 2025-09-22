// filename: controllers/socialController.js
const User = require('../models/User');

// ---------------- Get connected social accounts ----------------
const getConnectedAccounts = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id).select(
      'twitterId linkedinId instagramId'
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        twitter: !!user.twitterId,
        linkedin: !!user.linkedinId,
        instagram: !!user.instagramId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Disconnect social account ----------------
const disconnectAccount = async (req, res, next) => {
  try {
    const { platform } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    switch (platform) {
      case 'twitter':
        user.twitterId = undefined;
        user.twitter = undefined;
        break;
      case 'linkedin':
        user.linkedinId = undefined;
        user.linkedin = undefined;
        break;
      case 'instagram':
        user.instagramId = undefined;
        user.instagram = undefined;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid platform. Must be one of: twitter, linkedin, instagram',
        });
    }

    await user.save();

    res.json({
      success: true,
      data: { disconnected: platform },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConnectedAccounts,
  disconnectAccount,
};
