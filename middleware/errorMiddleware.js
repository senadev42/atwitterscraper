//For routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(` ${req.originalUrl} doesn't exist.`);
  res.status(404);
  next(error);
};

//For errors in routes
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode;
  if (statusCode < 400) {
    statusCode = 500;
  }

  let message = err.message;

  res.status(statusCode).json({
    message: message,
  });
};

export { notFound, errorHandler };
