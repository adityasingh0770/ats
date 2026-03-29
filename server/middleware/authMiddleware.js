const jwt = require('jsonwebtoken');
const { findUserById, userToPublic } = require('../store/fileStore');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Invalid token. Please log in again.';
    return res.status(401).json({ message: msg });
  }

  try {
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Account not found. Please log in again.' });
    }
    req.user = userToPublic(user);
    req.user._id = user._id;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { protect };
