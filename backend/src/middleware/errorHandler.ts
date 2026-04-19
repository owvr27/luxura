import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { statusCode = 500, message } = err;

  // Log error with security context
  logger.error('Error occurred:', {
    error: message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    statusCode,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Sanitize error messages for production
  const getSafeErrorMessage = (msg: string, code: number) => {
    if (process.env.NODE_ENV === 'production') {
      // Don't expose internal error details
      if (code >= 500) return 'Internal server error';
      if (code === 401) return 'Authentication required';
      if (code === 403) return 'Access denied';
      if (code === 404) return 'Resource not found';
      if (code === 409) return 'Resource conflict';
      if (code === 429) return 'Too many requests';
    }
    return msg;
  };

  const response = {
    success: false,
    error: getSafeErrorMessage(message, statusCode),
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    }),
  };

  res.status(statusCode).json(response);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
