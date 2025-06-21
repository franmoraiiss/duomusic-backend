import express from 'express';
import { updateStreak, getTopStreaks, getCurrentStreak } from '../controllers/streak';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/update', authenticateToken, updateStreak);
router.get('/current', authenticateToken, getCurrentStreak);

router.get('/top', getTopStreaks);

export default router; 
