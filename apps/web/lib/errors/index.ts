// Custom error classes
export class HarmonyError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'HarmonyError'
  }
}

export class AuthError extends HarmonyError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthError'
  }
}

export class NetworkError extends HarmonyError {
  constructor(message: string = 'Network error') {
    super(message, 'NETWORK_ERROR', 503)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends HarmonyError {
  constructor(message: string = 'Validation failed') {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends HarmonyError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

// Error handler utility
export const handleError = (error: unknown): HarmonyError => {
  if (error instanceof HarmonyError) {
    return error
  }
  
  if (error instanceof Error) {
    return new HarmonyError(error.message, 'UNKNOWN_ERROR')
  }
  
  return new HarmonyError('An unknown error occurred', 'UNKNOWN_ERROR')
}
