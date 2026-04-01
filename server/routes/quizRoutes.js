const express = require('express');
const router = express.Router();
const { startQuiz, submitAnswer, requestHint, requestRemedial } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startQuiz);
router.post('/answer', protect, submitAnswer);
router.get('/hint', protect, requestHint);
router.get('/remedial', protect, requestRemedial);

module.exports = router;
