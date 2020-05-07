const User = require('../models/User');

module.exports = async (req, res, next) => {
  // maybe should call it token instead of authorization
  const authorization = req.headers.authorization;
  try {
    if (!authorization) {
      const error = new Error('Authorization required!');
      error.statusCode = 401;
      throw error;
    }
    // by adding user to the req, I'm like moving this variable to
    // the next middleware
    req.user = await User.getUserFromToken(authorization);
    if (!req.user) {
      const error = new Error('Authorization required!');
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
