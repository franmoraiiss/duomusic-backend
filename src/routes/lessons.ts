import express from 'express';
import { saveCompletedLessons, getCompletedLessons, addCompletedLesson } from '../controllers/lessons';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Save all completed lessons (overwrites existing)
router.post('/save', saveCompletedLessons);

// Get user's completed lessons
router.get('/completed', getCompletedLessons);

// Add a single completed lesson
router.post('/complete', addCompletedLesson);

export default router; 
