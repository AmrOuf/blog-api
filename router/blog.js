const User = require('../models/User');
const Blog = require('../models/Blog');
const authenticateUser = require('../middleware/authentication');

const express = require('express');
const router = express.Router();

// TODOs
// edit blog

router.get('/', authenticateUser, async (req, res, next) => {
  const blogs = await Blog.find()
    .populate('author')
    .sort({ createdAt: 'desc' });
  res.send(blogs);
});

router.get('/add', authenticateUser, async (req, res, next) => {
  const authorId = req.user.id;
  const { title, body, tags = [] } = req.body;
  const blog = new Blog({
    title,
    body,
    author: authorId,
    tags,
  });
  const savedBlog = await blog.save();
  res.send(savedBlog);
});

router.delete('/delete/:id', authenticateUser, async (req, res, next) => {
  const userId = req.user.id;
  const blogId = req.params.id;
  const blog = await Blog.findOne({ _id: blogId }).populate('author');

  if (!blog) {
    const error = new Error('Not Found');
    error.statusCode = 404;
    throw error;
  }

  if (blog.author.id !== userId) {
    const error = new Error('Not Authorized');
    error.statusCode = 401;
    throw error;
  }

  const deleted = await Blog.deleteOne({ _id: blogId });
  res.send(deleted);
});

router.patch('/edit/:id', authenticateUser, async (req, res, next) => {
  const userId = req.user.id;
  const blogId = req.params.id;
  const blog = await Blog.findOne({ _id: blogId }).populate('author');

  if (!blog) {
    const error = new Error('Not Found');
    error.statusCode = 404;
    throw error;
  }

  if (blog.author.id !== userId) {
    const error = new Error('Not Authorized');
    error.statusCode = 401;
    throw error;
  }

  const { title = blog.title, body = blog.body, tags = blog.tags } = req.body;

  const updated = await Blog.updateOne(
    { _id: blogId },
    { title: title, body: body, tags: tags }
  );

  res.send(updated);
});

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
