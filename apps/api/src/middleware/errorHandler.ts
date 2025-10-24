import { Request, Response, NextFunction } from 'express'

// Define ApiResponse interface locally
interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error)

  const response: ApiResponse = {
    success: false,
    error: error.message || 'Internal server error',
    message: 'An error occurred while processing your request'
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    response.error = 'Validation error'
    response.message = error.message
    return res.status(400).json(response)
  }

  if (error.name === 'UnauthorizedError') {
    response.error = 'Unauthorized'
    response.message = 'Authentication required'
    return res.status(401).json(response)
  }

  if (error.name === 'ForbiddenError') {
    response.error = 'Forbidden'
    response.message = 'Access denied'
    return res.status(403).json(response)
  }

  if (error.name === 'NotFoundError') {
    response.error = 'Not found'
    response.message = 'Resource not found'
    return res.status(404).json(response)
  }

  // Default to 500
  res.status(500).json(response)
}
