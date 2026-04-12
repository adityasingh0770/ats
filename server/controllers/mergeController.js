const jwt = require('jsonwebtoken');
const { findOrCreateMergeUser, userToPublic } = require('../store/fileStore');
const { handleError } = require('../utils/dbError');

/**
 * POST /api/merge/entry
 * Auto-login for students arriving from the Merge portal.
 * Creates (or finds) a password-less user keyed on student_id and returns our JWT.
 */
const mergeEntry = async (req, res) => {
  try {
    const { student_id } = req.body;
    const mergeToken = (req.headers['x-merge-token'] || '').trim();

    if (!student_id) {
      return res.status(400).json({ message: 'student_id is required.' });
    }
    if (!mergeToken) {
      return res.status(400).json({ message: 'Merge token is required (X-Merge-Token header).' });
    }

    const user = findOrCreateMergeUser(String(student_id));

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    res.json({ token, user: userToPublic(user) });
  } catch (err) {
    handleError(err, res);
  }
};

/**
 * POST /api/merge/recommend
 * Server-side proxy for the course Recommendation API.
 * Client passes the Merge bearer token via X-Merge-Token header;
 * we forward it as Authorization to the portal and relay the response.
 */
const recommendProxy = async (req, res) => {
  try {
    const mergeToken = (req.headers['x-merge-token'] || '').trim();
    if (!mergeToken) {
      return res.status(400).json({ message: 'X-Merge-Token header is required.' });
    }

    const payload = req.body;
    if (!payload || !payload.student_id || !payload.session_id) {
      return res.status(400).json({ message: 'Recommendation payload is incomplete.' });
    }

    const portalRes = await fetch('https://kaushik-dev.online/api/recommend/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mergeToken}`,
      },
      body: JSON.stringify(payload),
    });

    let data;
    const contentType = portalRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await portalRes.json();
    } else {
      data = { raw: await portalRes.text() };
    }

    res.status(portalRes.status).json(data);
  } catch (err) {
    console.error('Recommend proxy error:', err.message);
    res.status(502).json({ message: 'Failed to reach the recommendation API.' });
  }
};

module.exports = { mergeEntry, recommendProxy };
