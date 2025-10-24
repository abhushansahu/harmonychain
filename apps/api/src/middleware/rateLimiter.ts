import { Request, Response, NextFunction } from 'express'

// Simple in-memory rate limiter for Web3 API
const requests = new Map<string, { count: number; resetTime: number }>()

export const rateLimiter = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown'
    const now = Date.now()
    
    const clientData = requests.get(clientId)
    
    if (clientData) {
      if (now < clientData.resetTime) {
        if (clientData.count >= maxRequests) {
          return res.status(429).json({
            success: false,
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.'
          })
        }
        clientData.count++
      } else {
        requests.set(clientId, { count: 1, resetTime: now + windowMs })
      }
    } else {
      requests.set(clientId, { count: 1, resetTime: now + windowMs })
    }
    
    next()
  }
}