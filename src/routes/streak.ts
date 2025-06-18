import express from 'express';
import { updateStreak, getTopStreaks, getCurrentStreak } from '../controllers/streak';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected route - requires authentication
router.post('/update', authenticateToken, updateStreak);
router.get('/current', authenticateToken, getCurrentStreak);

// Public route - no authentication required
router.get('/top', getTopStreaks);

export default router; 
