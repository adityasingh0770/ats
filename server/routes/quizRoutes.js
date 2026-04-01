const express = require('express');
const router = express.Router();
const { startQuiz, submitAnswer, requestHint, requestRemedial } = require('../controllers/quizController');
const { postAdaptiveHints } = require('../controllers/adaptiveHintController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startQuiz);
router.post('/answer', protect, submitAnswer);
router.post('/adaptive-hints', protect, postAdaptiveHints);
router.get('/hint', protect, requestHint);
router.get('/remedial', protect, requestRemedial);

module.exports = router;
