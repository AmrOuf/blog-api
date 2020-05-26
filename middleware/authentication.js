const User = require('../models/User');
const customError = require('../helpers/customError');

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    const error = new customError('Not Authorized!', 401);
    next(error);
  }
  // by adding user to the req, I'm like moving this variable to the next middleware
  req.user = await User.getUserFromToken(authorization);
  if (!req.user) {
    const error = new customError('Not Authorized!', 401);
    next(error);
  }
  next();
};
