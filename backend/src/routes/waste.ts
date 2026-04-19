import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { WasteClassificationService } from '../services/wasteClassificationService.js';

const router = Router();
const wasteService = WasteClassificationService.getInstance();

const classifySchema = z.object({
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  imageUrl: z.string().url().optional(),
});

// Classify waste item
router.post('/classify', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = classifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input data',
      details: parsed.error.errors,
    });
  }

  const { description, imageUrl } = parsed.data;
  const userId = req.user!.id;

  const result = await wasteService.classifyWaste(description, imageUrl);

  res.json({
    success: true,
    data: {
      classification: result,
      timestamp: new Date().toISOString(),
    },
  });
}));

// Get environmental impact for user
router.get('/impact', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  
  const impact = await wasteService.getEnvironmentalImpact(userId);

  res.json({
    success: true,
    data: impact,
  });
}));

// Get recycling recommendations
router.get('/recommendations', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  
  const recommendations = await wasteService.getRecyclingRecommendations(userId);

  res.json({
    success: true,
    data: recommendations,
  });
}));

// Get waste categories info
router.get('/categories', asyncHandler(async (req: Request, res: Response) => {
  const categories = [
    {
      id: 'plastic',
      name: 'Plastic',
      description: 'Plastic bottles, containers, bags, and packaging',
      recyclable: true,
      averagePoints: 12,
      co2SavedPerKg: 1.5,
      icon: '♻️',
      color: '#3B82F6',
    },
    {
      id: 'paper',
      name: 'Paper',
      description: 'Newspapers, cardboard, magazines, and office paper',
      recyclable: true,
      averagePoints: 8,
      co2SavedPerKg: 0.8,
      icon: '📄',
      color: '#10B981',
    },
    {
      id: 'metal',
      name: 'Metal',
      description: 'Aluminum cans, steel containers, and metal foil',
      recyclable: true,
      averagePoints: 25,
      co2SavedPerKg: 2.0,
      icon: '🔧',
      color: '#6B7280',
    },
    {
      id: 'glass',
      name: 'Glass',
      description: 'Glass bottles, jars, and containers',
      recyclable: true,
      averagePoints: 15,
      co2SavedPerKg: 1.2,
      icon: '🍶',
      color: '#8B5CF6',
    },
    {
      id: 'organic',
      name: 'Organic',
      description: 'Food waste, yard waste, and compostable materials',
      recyclable: true,
      averagePoints: 10,
      co2SavedPerKg: 0.5,
      icon: '🌱',
      color: '#84CC16',
    },
    {
      id: 'electronic',
      name: 'Electronic',
      description: 'Electronic devices, batteries, and cables',
      recyclable: true,
      averagePoints: 50,
      co2SavedPerKg: 2.5,
      icon: '📱',
      color: '#F59E0B',
    },
    {
      id: 'hazardous',
      name: 'Hazardous',
      description: 'Chemicals, paint, medical waste, and toxic materials',
      recyclable: false,
      averagePoints: 0,
      co2SavedPerKg: 0,
      icon: '⚠️',
      color: '#EF4444',
    },
  ];

  res.json({
    success: true,
    data: categories,
  });
}));

export default router;
