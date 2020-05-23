const userRouter = require('./router/user');
const blogRouter = require('./router/blog');
require('./db/db');
const { globalErrorHandler } = require('./helpers/errorHandlers');

const express = require('express');
const cors = require('cors');
require('express-async-errors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('./public'));


app.get('/', (req, res, next) => {
  res.send('Hello, everyone!');
});

app.use(['/user', '/users'], userRouter);
app.use(['/blog', '/blogs'], blogRouter);

app.use(globalErrorHandler);

app.listen(port, () =>
  console.log(`Blog app listening at http://localhost:${port}`)
);
