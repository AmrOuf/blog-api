const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to mongodb successfully');
  })
  .catch((err) => {
    // if you couldn't connect to the database, fail early
    console.log('failed to connect');
    process.exit(1);
  });
