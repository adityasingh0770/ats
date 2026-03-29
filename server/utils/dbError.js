/**
 * Friendly error responses (no MongoDB — file store + bundled questions).
 */
const handleError = (err, res) => {
  const msg = err?.message || '';

  if (err.name === 'ValidationError' && err.errors) {
    const first = Object.values(err.errors)[0]?.message || 'Validation error.';
    return res.status(400).json({ message: first });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  if (msg.includes('ENOENT') || msg.includes('EACCES')) {
    return res.status(503).json({
      message: 'Could not read or write data. Check server disk permissions or DATA_FILE_PATH.',
    });
  }

  console.error('Unhandled error:', err.name, err.message, err.code);
  return res.status(500).json({ message: 'Something went wrong. Please try again.' });
};

module.exports = { handleError };
