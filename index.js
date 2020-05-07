const userRouter = require('./router/user');
const blogRouter = require('./router/blog');
require('./db/db');

const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', userRouter);
app.use('/blogs', blogRouter);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
