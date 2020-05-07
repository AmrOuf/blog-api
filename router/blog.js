const User = require('../models/User');
const Blog = require('../models/Blog');
const authenticateUser = require('../middleware/authentication');

const express = require('express');

const router = express.Router();

// blogs of the followers of the logged in user lol
router.get('/following', authenticateUser, async (req, res, next) => {
  const user = req.user;
  // get blogs of one user, may be use it in a different handler
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
});

module.exports = router;
