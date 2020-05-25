const mongoose = require('mongoose');

if (!process.env.MONGO_URI) {
  // should this be a custom error?
  throw new Error('Database URI can not be found');
}
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to mongodb successfully');
  })
  .catch((err) => {
    // if you couldn't connect to the database, fail early
    console.log('failed to connect to mongo db. Check services.');
    process.exit(1);
  });
