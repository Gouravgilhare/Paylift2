class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDB ID error
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    err = new AppError(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    err = new AppError(message, 409);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid authentication token", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new AppError("Authentication token has expired", 401);
  }

  // Validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    err = new AppError(messages, 400);
  }

  // Taxi-specific errors
  if (err.message.includes("No drivers available")) {
    err = new AppError(
      "No drivers available in your area. Please try again later.",
      503
    );
  }

  if (err.message.includes("Ride not found")) {
    err = new AppError("Requested ride does not exist", 404);
  }

  if (err.message.includes("Driver not found")) {
    err = new AppError("Driver information not available", 404);
  }

  if (err.message.includes("Insufficient balance")) {
    err = new AppError("Insufficient wallet balance. Please add funds.", 402);
  }

  if (err.message.includes("Invalid location")) {
    err = new AppError("Invalid pickup or dropoff location provided", 400);
  }

  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, AppError, asyncHandler };
