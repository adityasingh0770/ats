const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

connectDB();

// CORS: if CLIENT_ORIGIN is set → only those origins (+ localhost for local dev).
// If unset → reflect the request Origin (so Vercel works without env); set CLIENT_ORIGIN in production to lock this down.
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const envOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (envOrigins.length === 0) {
  app.use(cors({ origin: true, credentials: true }));
  console.log('CORS: allowing any Origin (reflect). Set CLIENT_ORIGIN on the server to restrict to your frontend URL.');
} else {
  const corsOrigins = [...defaultOrigins, ...envOrigins];
  app.use(cors({ origin: corsOrigins, credentials: true }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/session', require('./routes/sessionRoutes'));

app.get('/api/health', (req, res) =>
  res.json({
    status: 'OK',
    message: 'MathMentor API running',
  })
);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8787;
const server = app.listen(PORT, () => {
  console.log(`MathMentor server running on port ${PORT}`);
  console.log(`Node ${process.version}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use — another process (often an old Node server) is listening.`);
    console.error('Fix: stop that process, then restart this server.');
    console.error('  Windows: netstat -ano | findstr :' + PORT + '   → note the PID → taskkill /PID <pid> /F');
    console.error('  Or set a different PORT in server/.env and match VITE_API_PROXY_TARGET in client/.env\n');
    process.exit(1);
  }
  throw err;
});
