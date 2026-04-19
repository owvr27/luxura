import { logger } from './logger.js';
// Simple in-memory cache implementation
// In production, consider using Redis or another distributed cache
class MemoryCache {
    cache = new Map();
    cleanupInterval;
    constructor() {
        // Clean up expired entries every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }
    set(key, value, ttl = 300000) {
        const entry = {
            value,
            expires: Date.now() + ttl,
            accessCount: 0,
            lastAccessed: Date.now(),
        };
        this.cache.set(key, entry);
        logger.debug('Cache entry set', { key, ttl });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expires) {
            this.cache.delete(key);
            return null;
        }
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry.value;
    }
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            logger.debug('Cache entry deleted', { key });
        }
        return deleted;
    }
    clear() {
        const size = this.cache.size;
        this.cache.clear();
        logger.info('Cache cleared', { previousSize: size });
    }
    has(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        if (Date.now() > entry.expires) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    size() {
        return this.cache.size;
    }
    keys() {
        return Array.from(this.cache.keys());
    }
    getStats() {
        const entries = Array.from(this.cache.values());
        const totalAccess = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
        const avgAccess = entries.length > 0 ? totalAccess / entries.length : 0;
        return {
            size: this.cache.size,
            totalAccess,
            avgAccess,
            oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.lastAccessed)) : null,
            newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.lastAccessed)) : null,
        };
    }
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expires) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            logger.debug('Cache cleanup completed', { cleaned, remaining: this.cache.size });
        }
    }
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.clear();
    }
}
// Global cache instance
export const cache = new MemoryCache();
// Cache middleware factory
export function createCacheMiddleware(options = {}) {
    const { keyGenerator = (req) => `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`, ttl = 300000, // 5 minutes default
    skipCache = () => false, condition = () => true, } = options;
    return (req, res, next) => {
        // Skip caching for non-GET requests or when condition is false
        if (req.method !== 'GET' || !condition(req) || skipCache(req)) {
            return next();
        }
        const cacheKey = keyGenerator(req);
        const cached = cache.get(cacheKey);
        if (cached) {
            logger.debug('Cache hit', { key: cacheKey });
            res.set('X-Cache', 'HIT');
            return res.json(cached);
        }
        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = function (data) {
            // Only cache successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache.set(cacheKey, data, ttl);
                logger.debug('Cache set', { key: cacheKey, statusCode: res.statusCode });
            }
            res.set('X-Cache', 'MISS');
            return originalJson.call(this, data);
        };
        next();
    };
}
// Cache decorators for services
export function Cacheable(ttl = 300000, keyPrefix) {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            const cacheKey = keyPrefix
                ? `${keyPrefix}:${propertyName}:${JSON.stringify(args)}`
                : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
            const cached = cache.get(cacheKey);
            if (cached !== null) {
                return cached;
            }
            const result = await method.apply(this, args);
            cache.set(cacheKey, result, ttl);
            return result;
        };
    };
}
// Cache invalidation helpers
export function invalidateCachePattern(pattern) {
    const keys = cache.keys();
    const regex = new RegExp(pattern);
    let invalidated = 0;
    for (const key of keys) {
        if (regex.test(key)) {
            cache.delete(key);
            invalidated++;
        }
    }
    logger.info('Cache pattern invalidated', { pattern, invalidated });
    return invalidated;
}
export function invalidateCacheByPrefix(prefix) {
    const keys = cache.keys();
    let invalidated = 0;
    for (const key of keys) {
        if (key.startsWith(prefix)) {
            cache.delete(key);
            invalidated++;
        }
    }
    logger.info('Cache prefix invalidated', { prefix, invalidated });
    return invalidated;
}
// Cache warming utilities
export async function warmCache(warmers) {
    logger.info('Starting cache warming', { count: warmers.length });
    const results = await Promise.allSettled(warmers.map(async (warmer) => {
        try {
            const start = Date.now();
            await warmer.warm();
            const duration = Date.now() - start;
            logger.debug('Cache warmer completed', { key: warmer.key, duration });
        }
        catch (error) {
            logger.error('Cache warmer failed', { key: warmer.key, error });
        }
    }));
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    logger.info('Cache warming completed', { successful, failed });
}
// Export cache instance for direct usage
export default cache;
