import express from 'express';
import {
  handleChatQuery,
  startChatSession,
  getChatSession,
  endChatSession,
  getAIRecommendations
} from '../controllers/aiChatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/recommend', getAIRecommendations);

// Protected routes
router.use(protect);
router.post('/chat', handleChatQuery);
router.post('/start-session', startChatSession);
router.get('/session/:sessionId', getChatSession);
router.delete('/session/:sessionId', endChatSession);

export default router;
