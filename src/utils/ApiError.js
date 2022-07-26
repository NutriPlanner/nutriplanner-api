class ApiError extends Error {
  constructor({ statusCode, internalCode, data, message, isOperational = true, stack = '' }) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.internalCode = internalCode;
    this.data = data;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
