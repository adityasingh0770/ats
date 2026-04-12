const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  createUser,
  createLearner,
  findLearnerByUserId,
  matchPassword,
  findOrCreateGuestUser,
} = require('../store/fileStore');
const { handleError } = require('../utils/dbError');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const exists = findUserByEmail(email);
    if (exists) return res.status(400).json({ message: 'Email already registered.' });

    const user = await createUser({ name, email, password });
    createLearner(user._id);

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        grade: user.grade,
        isGuestUser: !!user.isGuestUser,
      },
    });
  } catch (err) {
    handleError(err, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password.' });

    const user = findUserByEmail(email);
    if (!user || !(await matchPassword(user, password)))
      return res.status(401).json({ message: 'Invalid email or password.' });

    if (!findLearnerByUserId(user._id)) createLearner(user._id);

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        grade: user.grade,
        isGuestUser: !!user.isGuestUser,
      },
    });
  } catch (err) {
    handleError(err, res);
  }
};

/** No password — used when the app runs without login (browser sends stable guest_key). */
const guest = async (req, res) => {
  try {
    const guestKey = req.body?.guest_key;
    const user = findOrCreateGuestUser(typeof guestKey === 'string' ? guestKey : '');

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        grade: user.grade,
        isGuestUser: !!user.isGuestUser,
      },
    });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { register, login, guest };
