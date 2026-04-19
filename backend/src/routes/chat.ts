import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler, CustomError } from '../middleware/errorHandler.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { ChatService } from '../services/chatService.js';

const router = Router();
const chatService = new ChatService();

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

// Chat endpoint - public for demo purposes
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new CustomError('Invalid message format', 400);
  }

  const { message } = parsed.data;
  // Use a demo user ID for now
  const userId = 'demo-user';

  const response = await chatService.processMessage(message, userId);

  res.json({
    success: true,
    data: {
      message: response.message,
      suggestions: response.suggestions,
      timestamp: new Date().toISOString(),
    },
  });
}));

// Chat history endpoint
router.get('/history', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  const history = await chatService.getChatHistory(userId, limit, offset);

  res.json({
    success: true,
    data: history,
  });
}));

// Clear chat history
router.delete('/history', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  await chatService.clearChatHistory(userId);

  res.json({
    success: true,
    message: 'Chat history cleared successfully',
  });
}));

export default router;
