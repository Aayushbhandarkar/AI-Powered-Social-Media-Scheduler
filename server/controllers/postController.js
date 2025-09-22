const Post = require('../models/Post');

// Get all posts for user
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .sort({ scheduledDate: 1 });
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// Get single post
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Create new post
const createPost = async (req, res, next) => {
  try {
    const { content, platforms, scheduledDate, aiContext } = req.body;
    
    const post = await Post.create({
      userId: req.user.id,
      content,
      platforms,
      scheduledDate,
      aiContext
    });
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Update post
const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};