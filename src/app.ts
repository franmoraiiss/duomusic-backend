import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import streakRoutes from './routes/streak';
import openaiRoutes from './routes/openai';
import lessonsRoutes from './routes/lessons';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/openai', openaiRoutes);
app.use('/api/lessons', lessonsRoutes);

// Debug route to test if server is responding
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/streak/current');
  console.log('- POST /api/streak/update');
  console.log('- GET /api/streak/top');
  console.log('- POST /api/openai/generate-questions');
  console.log('- POST /api/lessons/save');
  console.log('- GET /api/lessons/completed');
  console.log('- POST /api/lessons/complete');
}); 
