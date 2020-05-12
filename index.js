const userRouter = require('./router/user');
const blogRouter = require('./router/blog');
require('./db/db');

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res, next) => {
  res.send('Hello, everyone!');
});

app.use(['/user', '/users'], userRouter);
app.use(['/blog', '/blogs'], blogRouter);

app.listen(port, () =>
  console.log(`Blog app listening at http://localhost:${port}`)
);
