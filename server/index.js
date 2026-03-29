const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

connectDB();

// CLIENT_ORIGIN: comma-separated list, e.g. https://mathmentor.vercel.app,http://localhost:5173
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const envOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const corsOrigins = envOrigins.length > 0 ? [...defaultOrigins, ...envOrigins] : defaultOrigins;

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/session', require('./routes/sessionRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'MathMentor API running' }));

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5001;
const server = app.listen(PORT, () => console.log(`MathMentor server running on port ${PORT}`));

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
