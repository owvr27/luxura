import { Router, type Request, type Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { GamificationService } from '../services/gamificationService.js';

const router = Router();
const gamificationService = GamificationService.getInstance();

// Get user progress and stats
router.get('/progress', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  
  const progress = await gamificationService.getUserProgress(userId);

  res.json({
    success: true,
    data: progress,
  });
}));

// Get leaderboard
router.get('/leaderboard', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  
  const leaderboard = await gamificationService.getLeaderboard(limit, offset);

  res.json({
    success: true,
    data: leaderboard,
  });
}));

// Get achievements list
router.get('/achievements', asyncHandler(async (req: Request, res: Response) => {
  const achievements = gamificationService.getAchievementsList();

  res.json({
    success: true,
    data: achievements,
  });
}));

// Check and unlock new achievements
router.post('/achievements/check', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  
  const newlyUnlocked = await gamificationService.checkAndUnlockAchievements(userId);

  res.json({
    success: true,
    data: {
      newlyUnlocked,
      count: newlyUnlocked.length,
    },
  });
}));

export default router;
