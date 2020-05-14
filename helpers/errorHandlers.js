const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  const handledError = err.statusCode < 500;
  res.status(err.statusCode).send({
    message: handledError ? err.message : 'Internal Server Error!',
    errors: err.errors || {},
  });
};

module.exports = { globalErrorHandler };
