import express from 'express';
import { saveCompletedLessons, getCompletedLessons, addCompletedLesson } from '../controllers/lessons';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);
router.post('/save', saveCompletedLessons);
router.get('/completed', getCompletedLessons);
router.post('/complete', addCompletedLesson);

export default router; 
