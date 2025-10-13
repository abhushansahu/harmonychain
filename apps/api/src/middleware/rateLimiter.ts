import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';

const rateLimiter = new RateLimiterRedis({
  storeClient: getRedisClient(),
  keyPrefix: 'rl',
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.ip || 'unknown';
    await rateLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    
    logger.warn('Rate limit exceeded:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      retryAfter: secs,
    });

    res.set('Retry-After', String(secs));
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests',
        retryAfter: secs,
      },
    });
  }
};

export { rateLimiterMiddleware as rateLimiter };
