const User = require('../models/User');
const Blog = require('../models/Blog');

const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const authorization = req.headers.authorization;

  try {
    if (!authorization) {
      const error = new Error('Authorization required!');
      // 3shan mayedeesh 500
      error.statusCode = 401;
      throw error;
    }

    const user = await User.getUserFromToken(authorization);
    if (!user) {
      const error = new Error('Authorization required!');
      error.statusCode = 401;
      throw error;
    }

    const users = await User.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
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

    const viewedUser = await User.findById(req.params.id);
    const blogs = await Blog.find({ author: req.params.id });

    const fullUser = {
      user: viewedUser,
      blogs: blogs,
    };
    res.send(fullUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
