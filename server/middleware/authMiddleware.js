const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  // 1. Verify JWT signature + expiry first (no DB call)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Invalid token. Please log in again.';
    return res.status(401).json({ message: msg });
  }

  // 2. Then check DB (separately so DB errors don't masquerade as auth errors)
  try {
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) {
      return res.status(401).json({ message: 'Account not found. Please log in again.' });
    }
    next();
  } catch (err) {
    console.error('Auth middleware DB error:', err.message);
    return res.status(503).json({ message: 'Server unavailable. Please check your connection and try again.' });
  }
};

module.exports = { protect };
