const User = require('./models/User');
const Blog = require('./models/Blog');
const userRouter = require('./router/user');
const blogRouter = require('./router/blog');
require('./db/db');

const express = require('express');
const { validate, ValidationError, Joi } = require('express-validation');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const saltRounds = 10;

const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Amr :)');
});

app.use('/users', userRouter);
app.use('/blogs', blogRouter);

app.post('/register', async (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;
  password = await bcrypt.hash(password, saltRounds);
  const user = new User({ firstName, lastName, email, password });
  const savedUser = await user.save();
  res.send(savedUser);
});

app.post('/login', validate(loginValidation), async (req, res, next) => {
  // check password
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

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
