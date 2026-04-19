import { logger } from '../utils/logger.js';
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Log request
    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
    });
    // Capture response
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
        return originalSend.call(this, data);
    };
    next();
};
