import { AuthService } from '../services/authService.js';
import { asyncHandler, CustomError } from './errorHandler.js';
const authService = new AuthService();
export const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError('Authentication required', 401);
    }
    const token = authHeader.substring(7);
    if (!token) {
        throw new CustomError('Authentication token required', 401);
    }
    const user = await authService.verifyToken(token);
    req.user = user;
    next();
});
export const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new CustomError('Authentication required', 401);
        }
        if (!roles.includes(req.user.role)) {
            throw new CustomError('Insufficient permissions', 403);
        }
        next();
    };
};
export const requireAdmin = authorize(['admin']);
export const requireUser = authorize(['user', 'admin']);
