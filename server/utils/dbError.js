/**
 * Returns a friendly error response for DB / network failures.
 * Call this in every controller catch block.
 */
const mongoose = require('mongoose');

const handleError = (err, res) => {
  const msg = err?.message || '';

  // If Mongoose isn't connected at all, every DB operation will fail
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected. Please check your internet connection and try again.',
    });
  }

  // MongoDB connection / network / SSL / buffering errors
  if (
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoExpiredSessionError' ||
    msg.includes('SSL') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('connect EHOSTUNREACH') ||
    msg.includes('wrong version number') ||
    msg.includes('buffering timed out') ||
    msg.includes('Client must be connected')
  ) {
    return res.status(503).json({
      message: 'Database connection failed. Please check your internet connection and try again.',
    });
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors)[0]?.message || 'Validation error.';
    return res.status(400).json({ message: first });
  }

  // Duplicate key (email already exists, etc.)
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  console.error('Unhandled error:', err.name, err.message, err.code);
  return res.status(500).json({ message: 'Something went wrong. Please try again.' });
};

module.exports = { handleError };
