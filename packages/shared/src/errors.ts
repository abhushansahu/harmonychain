export class HarmonyChainError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends HarmonyChainError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundError extends HarmonyChainError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}

export class UnauthorizedError extends HarmonyChainError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401)
  }
}

export class ForbiddenError extends HarmonyChainError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403)
  }
}

export class ConflictError extends HarmonyChainError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409)
  }
}

export class RateLimitError extends HarmonyChainError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429)
  }
}

export class NetworkError extends HarmonyChainError {
  constructor(message: string = 'Network error') {
    super(message, 503)
  }
}

export class ContractError extends HarmonyChainError {
  constructor(message: string = 'Smart contract error') {
    super(message, 500)
  }
}

export class IpfsError extends HarmonyChainError {
  constructor(message: string = 'IPFS error') {
    super(message, 500)
  }
}

export class FileError extends HarmonyChainError {
  constructor(message: string = 'File processing error') {
    super(message, 400)
  }
}