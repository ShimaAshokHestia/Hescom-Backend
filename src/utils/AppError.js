// Thrown by the SERVICE layer for expected/handled failures
// (not found, validation, duplicate, unauthorized, etc).
// The global errorHandler middleware reads `statusCode` off this
// to shape the response - controllers never need a try/catch for these.
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
