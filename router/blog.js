const User = require('../models/User');
const Blog = require('../models/Blog');

const express = require('express');

const router = express.Router();

// blogs of the followers of the logged in user lol
router.get('/following', async (req, res, next) => {
  const authorization = req.headers.authorization;

  try {
    if (!authorization) {
      const error = new Error('Authorization required!');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.getUserFromToken(authorization);
    if (!user) {
      const error = new Error('Authorization required!');
      error.statusCode = 401;
      throw error;
    }

    // get blogs of one user
    const blogsOfSpecificUser = await (
      await Blog.find().populate('author')
    ).filter((blog) => blog.author.id === '5eb31ccf0982bd00f490dc09');

    // get blogs of only the following users
    let blogsOfFollowing = [];
    for (let i = 0; i < user.following.length; i++) {
      const blogs = await (await Blog.find().populate('author')).filter(
        (blog) => blog.author.id === user.following[i].toString()
      );
      blogsOfFollowing = await [...blogsOfFollowing, ...blogs];
    }

    res.send(blogsOfFollowing);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
