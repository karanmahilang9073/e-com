// Centralized error handling middleware

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handler middleware (use at the END of all routes)
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Log error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    err.statusCode = 400;
    err.message = `Validation Error: ${message}`;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = `Invalid ID format`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 409;
    err.message = `${field} already exists`;
  }

  return res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message,
      statusCode: err.statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

// Catch async errors
export const catchAsyncErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
