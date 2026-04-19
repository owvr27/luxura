import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import env from './config.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { createCacheMiddleware } from './utils/cache.js';
// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import iotRoutes from './routes/iot.js';
import redeemRoutes from './routes/redeem.js';
import imageRoutes from './routes/images.js';
import chatRoutes from './routes/chat.js';
import wasteRoutes from './routes/waste.js';
import gamificationRoutes from './routes/gamification.js';
// Initialize Express app
const app = express();
// ============================================
// Security & Performance Middleware
// ============================================
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.openai.com"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
}));
// ============================================
// CORS Configuration
// ============================================
const corsOrigins = env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
const corsOptions = {
    origin: corsOrigins && corsOrigins.length > 0
        ? corsOrigins
        : (env.NODE_ENV === 'development'
            ? ['http://localhost:3000', 'http://127.0.0.1:3000']
            : false),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));
// ============================================
// Body Parser & Rate Limiting
// ============================================
// Handle raw binary data for image uploads FIRST (before JSON parser)
app.use('/api/images/upload', express.raw({ type: 'image/jpeg', limit: '10mb' }));
// Then JSON and URL-encoded parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// ============================================
// Request Logging
// ============================================
app.use(requestLogger);
// ============================================
// Health Check & API Info
// ============================================
app.get('/health', (_req, res) => {
    res.json({
        ok: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
    });
});
app.get('/', (_req, res) => {
    res.json({
        message: `${env.APP_NAME} API Server`,
        version: env.APP_VERSION,
        environment: env.NODE_ENV,
        endpoints: {
            health: '/health',
            auth: {
                register: '/auth/register',
                login: '/auth/login',
            },
            user: {
                profile: '/me',
                wallet: '/wallet',
                bins: '/bins',
                rewards: '/rewards',
            },
            redeem: '/redeem',
            admin: {
                dashboard: '/admin/dashboard',
                bins: '/admin/bins',
                operations: '/admin/operations',
            },
            iot: {
                operation: '/iot/operation',
            },
            images: {
                upload: '/api/images/upload',
                list: '/api/images',
                latest: '/api/images/latest',
                get: '/api/images/:filename',
            },
        },
        docs: 'Access the frontend at http://localhost:3000',
    });
});
// ============================================
// API Routes with Caching
// ============================================
app.use('/auth', authRoutes);
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/', iotRoutes);
app.use('/', redeemRoutes);
app.use('/', imageRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/gamification', gamificationRoutes);
// Add caching for read-heavy endpoints
app.use('/bins', createCacheMiddleware({ ttl: 60000 })); // 1 minute cache
app.use('/rewards', createCacheMiddleware({ ttl: 300000 })); // 5 minute cache
app.use('/api/waste/categories', createCacheMiddleware({ ttl: 3600000 })); // 1 hour cache
// ============================================
// Error Handling Middleware
// ============================================
app.use(errorHandler);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method,
    });
});
// ============================================
// Start Server
// ============================================
const port = env.PORT;
app.listen(Number(port), '0.0.0.0', () => {
    logger.info('\n' + '='.repeat(50));
    logger.info(`🚀 ${env.APP_NAME} API Server`);
    logger.info(`📦 Version: ${env.APP_VERSION}`);
    logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    logger.info(`🔗 Server running on http://localhost:${port}`);
    logger.info(`📡 CORS enabled for: ${corsOrigins?.join(', ') || 'all origins (development)'}`);
    logger.info('='.repeat(50) + '\n');
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
