import { z } from 'zod';
import { AuthService } from '../services/authService.js';
import { asyncHandler, CustomError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
const authService = new AuthService();
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    location: z.string().optional(),
});
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export class AuthController {
    static register = asyncHandler(async (req, res) => {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            throw new CustomError(`Validation failed: ${errors.map(e => e.message).join(', ')}`, 400);
        }
        const { user, token } = await authService.register(parsed.data);
        logger.info('User registered successfully', { userId: user.id, email: user.email });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    });
    static login = asyncHandler(async (req, res) => {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            throw new CustomError(`Validation failed: ${errors.map(e => e.message).join(', ')}`, 400);
        }
        const { user, token } = await authService.login(parsed.data.email, parsed.data.password);
        logger.info('User logged in successfully', { userId: user.id, email: user.email });
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    });
    static me = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new CustomError('User not authenticated', 401);
        }
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    phone: req.user.phone,
                    location: req.user.location,
                    createdAt: req.user.createdAt,
                },
            },
        });
    });
}
