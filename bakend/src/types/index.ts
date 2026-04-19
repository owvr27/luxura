// Common types used across the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface Bin {
  id: string;
  binId: string;
  lat: number;
  lng: number;
  status: 'Available' | 'Full' | 'Maintenance';
  capacityUsed: number;
  acceptsRecycling: boolean;
  lastOperationAt?: Date;
  apiKey: string;
}

export interface Operation {
  id: string;
  codeId: string;
  binId: string;
  bin: Bin;
  weight: number;
  timestamp: Date;
  points: number;
  status: 'Used' | 'Unused' | 'Expired';
  redeemedByUserId?: string;
  redeemedBy?: User;
  expiresAt?: Date;
  hmac: string;
  nonce: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  user: User;
  operationId: string;
  points: number;
  type: 'earned' | 'redeemed' | 'achievement' | 'bonus';
  createdAt: Date;
}

export interface Reward {
  id: string;
  title: string;
  pointsRequired: number;
  availability: number;
  metadata?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

export interface WasteCategory {
  id: string;
  name: string;
  description: string;
  recyclable: boolean;
  averagePoints: number;
  co2SavedPerKg: number;
  icon: string;
  color: string;
}

export interface EnvironmentalImpact {
  totalCO2Saved: number;
  totalPoints: number;
  recyclingStreak: number;
  rank: string;
  nextMilestone: {
    name: string;
    pointsNeeded: number;
    reward: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'recycling' | 'streak' | 'social' | 'milestone';
  requirement: {
    type: 'total_points' | 'recycling_streak' | 'items_recycled' | 'bins_used';
    value: number;
  };
  reward?: {
    type: 'points' | 'badge' | 'title';
    value: string | number;
  };
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  totalPoints: number;
  rank: number;
  level: string;
  achievements: number;
  recyclingStreak: number;
  co2Saved: number;
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  level: string;
  progressToNextLevel: number;
  nextLevelPoints: number;
  recyclingStreak: number;
  totalRecycled: number;
  co2Saved: number;
  achievementsUnlocked: string[];
  rank: number;
}

// Request/Response types for validation
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export interface ChatRequest {
  message: string;
}

export interface WasteClassificationRequest {
  description: string;
  imageUrl?: string;
}

export interface WasteClassificationResult {
  category: 'plastic' | 'paper' | 'metal' | 'glass' | 'organic' | 'electronic' | 'hazardous';
  confidence: number;
  recyclable: boolean;
  points: number;
  co2Saved: number;
  disposalInstructions: string[];
  recyclingTips: string[];
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

// Database query options
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Environment configuration
export interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  JWT_SECRET: string;
  DATABASE_URL: string;
  CORS_ORIGIN: string;
  APP_NAME: string;
  APP_VERSION: string;
  OPENAI_API_KEY?: string;
}
