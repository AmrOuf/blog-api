const User = require('../models/User');
const Blog = require('../models/Blog');
const authenticateUser = require('../middleware/authentication');

const express = require('express');
const { validate, ValidationError, Joi } = require('express-validation');
const bcrypt = require('bcrypt');

const router = express.Router();
const saltRounds = 10;
const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

router.get('/', authenticateUser, async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});

router.get('/:id', authenticateUser, async (req, res, next) => {
  const viewedUser = await User.findById(req.params.id);
  const blogs = await Blog.find({ author: req.params.id });
  const user = {
    user: viewedUser,
    blogs: blogs,
  };
  res.send(user);
});

router.post('/register', async (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;
  password = await bcrypt.hash(password, saltRounds);
  const user = new User({ firstName, lastName, email, password });
  const savedUser = await user.save();
  res.send(savedUser);
});

router.post('/login', validate(loginValidation), async (req, res, next) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('Wrong email or password!');
    error.statusCode = 401;
    throw error;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    const error = new Error('Wrong email or password!');
    error.statusCode = 401;
    throw error;
  }

  // jwt token
  const token = await user.generateToken();
  res.send(token);
});

module.exports = router;
