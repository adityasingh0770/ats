const express = require('express');
const router = express.Router();
const { mergeEntry, recommendProxy } = require('../controllers/mergeController');
const { protect } = require('../middleware/authMiddleware');

// Public — called before the student has our JWT
router.post('/entry', mergeEntry);

// Protected — student already has our JWT (from /entry); Merge token via X-Merge-Token header
router.post('/recommend', protect, recommendProxy);

module.exports = router;
