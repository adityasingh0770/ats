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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MathMentor server running on port ${PORT}`));
