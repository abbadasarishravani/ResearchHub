import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import repositoryRoutes from './routes/repositories.js';
import codeReviewRoutes from './routes/codeReviews.js';
import commentRoutes from './routes/comments.js';
import suggestionRoutes from './routes/suggestions.js';
import prisma from './utils/prisma.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/code-reviews', codeReviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  (async () => {
    try {
      await prisma.$connect();
      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  })();
});
