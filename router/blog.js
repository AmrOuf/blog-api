const User = require('../models/User');
const Blog = require('../models/Blog');
const authenticateUser = require('../middleware/authentication');
const customError = require('../helpers/customError');

const express = require('express');
require('express-async-errors');
const router = express.Router();

router.post('/', async (req, res, next) => {
  const { pageNumber, pageSize } = req.body;
  //console.log(pageNumber, pageSize);
  const blogs = await Blog.find()
    .populate('author')
    .sort({ createdAt: 'desc' })
    .skip(pageNumber * pageSize)
    .limit(pageSize);
  res.send(blogs);
});

router.post('/searchbytitle', authenticateUser, async (req, res, next) => {
  const { pageNumber, pageSize } = req.body;
  const query = req.query.keyword.toLowerCase().trim();
  const allBlogs = await Blog.find()
    .populate('author')
    .sort({ createdAt: 'desc' });
  // handle if there is no query
  const blogs = allBlogs.filter((blog) => {
    return blog.title.toLowerCase().includes(query);
  });
  res.send(
    blogs.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)
  );
});

router.post('/searchbytags', authenticateUser, async (req, res, next) => {
  const { pageNumber, pageSize } = req.body;
  const allBlogs = await Blog.find()
    .populate('author')
    .sort({ createdAt: 'desc' });
  const query = req.query.keyword.toLowerCase().trim();
  // handle if there is no query
  const blogs = allBlogs.filter((blog) => {
    for (let i = 0; i < blog.tags.length; i++) {
      if (blog.tags[i].toLowerCase().includes(query)) {
        return true;
      }
    }
  });
  res.send(
    blogs.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)
  );
});

router.post('/add', authenticateUser, async (req, res, next) => {
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
    const error = new customError('Not Found!', 404);
    next(error);
  }

  if (blog.author.id !== userId) {
    const error = new customError('Not Authorized!', 401);
    next(error);
  }

  const deleted = await Blog.deleteOne({ _id: blogId });
  res.send(deleted);
});

router.patch('/edit/:id', authenticateUser, async (req, res, next) => {
  const userId = req.user.id;
  const blogId = req.params.id;
  const blog = await Blog.findOne({ _id: blogId }).populate('author');

  if (!blog) {
    const error = new customError('Not Found!', 404);
    next(error);
  }

  if (blog.author.id !== userId) {
    const error = new customError('Not Authorized!', 401);
    next(error);
  }

  const { title = blog.title, body = blog.body, tags = blog.tags } = req.body;

  const updated = await Blog.updateOne(
    { _id: blogId },
    { title: title, body: body, tags: tags }
  );

  res.send(updated);
});

router.get('/getById/:id', authenticateUser, async (req, res, next) => {
  const blogId = req.params.id;
  const blog = await Blog.findOne({ _id: blogId }).populate('author');

  if (!blog) {
    const error = new customError('Not Found!', 404);
    next(error);
  }

  res.send(blog);
})

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
