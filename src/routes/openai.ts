import express from 'express';
import { generateMusicTheoryQuestions } from '../controllers/openai';

const router = express.Router();

router.post('/generate-questions', generateMusicTheoryQuestions);

export default router; 
