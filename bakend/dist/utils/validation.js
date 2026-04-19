import { z } from 'zod';
// Common validation schemas
export const commonSchemas = {
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    phone: z.string().regex(/^[+]?[\d\s\-()]+$/, 'Invalid phone number').optional(),
    location: z.string().max(200, 'Location too long').optional(),
    id: z.string().cuid('Invalid ID format'),
    points: z.number().int().min(0, 'Points must be non-negative'),
    weight: z.number().positive('Weight must be positive'),
    coordinates: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
    }),
};
// Authentication schemas
export const authSchemas = {
    register: z.object({
        name: commonSchemas.name,
        email: commonSchemas.email,
        password: commonSchemas.password,
        phone: commonSchemas.phone,
        location: commonSchemas.location,
    }),
    login: z.object({
        email: commonSchemas.email,
        password: z.string().min(1, 'Password is required'),
    }),
};
// Chat schemas
export const chatSchemas = {
    sendMessage: z.object({
        message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
    }),
};
// Waste classification schemas
export const wasteSchemas = {
    classify: z.object({
        description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
        imageUrl: z.string().url('Invalid image URL').optional(),
    }),
};
// Bin schemas
export const binSchemas = {
    create: z.object({
        binId: z.string().min(1, 'Bin ID is required'),
        lat: commonSchemas.coordinates.shape.lat,
        lng: commonSchemas.coordinates.shape.lng,
        acceptsRecycling: z.boolean(),
        apiKey: z.string().min(1, 'API key is required'),
    }),
    update: z.object({
        status: z.enum(['Available', 'Full', 'Maintenance']).optional(),
        capacityUsed: z.number().min(0).max(100).optional(),
        acceptsRecycling: z.boolean().optional(),
    }),
    query: z.object({
        lat: commonSchemas.coordinates.shape.lat.optional(),
        lng: commonSchemas.coordinates.shape.lng.optional(),
        radius: z.number().positive('Radius must be positive').optional(),
        status: z.enum(['Available', 'Full', 'Maintenance']).optional(),
        acceptsRecycling: z.boolean().optional(),
    }),
};
// Operation schemas
export const operationSchemas = {
    create: z.object({
        codeId: z.string().min(1, 'Code ID is required'),
        binId: commonSchemas.id,
        weight: commonSchemas.weight,
        points: commonSchemas.points,
        hmac: z.string().min(1, 'HMAC is required'),
        nonce: z.string().min(1, 'Nonce is required'),
    }),
    redeem: z.object({
        codeId: z.string().min(1, 'Code ID is required'),
    }),
    query: z.object({
        userId: commonSchemas.id.optional(),
        binId: commonSchemas.id.optional(),
        status: z.enum(['Used', 'Unused', 'Expired']).optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
    }),
};
// Reward schemas
export const rewardSchemas = {
    create: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
        pointsRequired: commonSchemas.points,
        availability: z.number().int().min(0, 'Availability must be non-negative'),
        metadata: z.string().max(1000, 'Metadata too long').optional(),
    }),
    update: z.object({
        title: z.string().min(1).max(200).optional(),
        pointsRequired: commonSchemas.points.optional(),
        availability: z.number().int().min(0).optional(),
        metadata: z.string().max(1000).optional(),
    }),
    redeem: z.object({
        rewardId: commonSchemas.id,
    }),
};
// Pagination schemas
export const paginationSchemas = {
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
        search: z.string().max(100).optional(),
    }),
};
// User schemas
export const userSchemas = {
    update: z.object({
        name: commonSchemas.name.optional(),
        phone: commonSchemas.phone.optional(),
        location: commonSchemas.location.optional(),
    }),
    query: z.object({
        role: z.enum(['user', 'admin']).optional(),
        ...paginationSchemas.query.shape,
    }),
};
// Gamification schemas
export const gamificationSchemas = {
    leaderboard: z.object({
        limit: z.coerce.number().int().min(1).max(100).default(10),
        offset: z.coerce.number().int().min(0).default(0),
    }),
    achievements: z.object({
        category: z.enum(['recycling', 'streak', 'social', 'milestone']).optional(),
    }),
};
// Validation helper functions
export function validateInput(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errors = result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
        }));
        throw new Error(`Validation failed: ${errors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
    }
    return result.data;
}
export function validateQuery(schema, query = {}) {
    return validateInput(schema, query);
}
export function validateBody(schema, body) {
    return validateInput(schema, body);
}
export function validateParams(schema, params) {
    return validateInput(schema, params);
}
// Type guards
export function isValidEmail(email) {
    return commonSchemas.email.safeParse(email).success;
}
export function isValidPassword(password) {
    return commonSchemas.password.safeParse(password).success;
}
export function isValidPhone(phone) {
    return commonSchemas.phone.safeParse(phone).success;
}
export function isValidCoordinates(lat, lng) {
    return commonSchemas.coordinates.safeParse({ lat, lng }).success;
}
// Sanitization helpers
export function sanitizeString(input, maxLength) {
    let sanitized = input.trim();
    if (maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }
    return sanitized;
}
export function sanitizeEmail(email) {
    return sanitizeString(email.toLowerCase());
}
export function sanitizePhone(phone) {
    return phone.replace(/[^\d+\-\s()]/g, '');
}
