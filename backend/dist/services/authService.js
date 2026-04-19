import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../auth.js';
import prisma from '../prisma.js';
import env from '../config.js';
import { CustomError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
export class AuthService {
    JWT_SECRET = env.JWT_SECRET;
    JWT_EXPIRES_IN = '2h';
    async register(userData) {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (existingUser) {
            throw new CustomError('Email already exists', 409);
        }
        const passwordHash = await hashPassword(userData.password);
        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                location: userData.location,
                role: 'user',
                passwordHash,
            },
        });
        const token = this.generateToken(user);
        return { user, token };
    }
    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new CustomError('Invalid credentials', 401);
        }
        const isPasswordValid = await verifyPassword(user.passwordHash, password);
        if (!isPasswordValid) {
            throw new CustomError('Invalid credentials', 401);
        }
        const token = this.generateToken(user);
        logger.info('User authenticated', { userId: user.id, email });
        return { user, token };
    }
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    phone: true,
                    location: true,
                    createdAt: true,
                },
            });
            if (!user) {
                throw new CustomError('User not found', 401);
            }
            return user;
        }
        catch (error) {
            throw new CustomError('Invalid token', 401);
        }
    }
    generateToken(user) {
        return jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    }
}
