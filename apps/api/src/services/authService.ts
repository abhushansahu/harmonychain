import { SiweMessage } from 'siwe'
import jwt from 'jsonwebtoken'
import { ethers } from 'ethers'

export interface AuthResult {
  success: boolean
  token?: string
  user?: {
    address: string
    chainId: number
  }
  error?: string
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'
  private static readonly JWT_EXPIRES_IN = '7d'

  static async verifySignature(message: string, signature: string, address: string): Promise<AuthResult> {
    try {
      // Parse the SIWE message
      const siweMessage = new SiweMessage(message)
      
      // Verify the message fields
      const fields = await siweMessage.verify({ signature })
      
      if (!fields.success) {
        return {
          success: false,
          error: 'Invalid signature'
        }
      }

      // Verify the address matches
      if (fields.data.address.toLowerCase() !== address.toLowerCase()) {
        return {
          success: false,
          error: 'Address mismatch'
        }
      }

      // Verify the message is not expired
      const now = new Date()
      if (fields.data.expirationTime && new Date(fields.data.expirationTime) < now) {
        return {
          success: false,
          error: 'Message expired'
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          address: fields.data.address,
          chainId: fields.data.chainId,
          nonce: fields.data.nonce
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      )

      return {
        success: true,
        token,
        user: {
          address: fields.data.address,
          chainId: fields.data.chainId
        }
      }
    } catch (error) {
      console.error('SIWE verification error:', error)
      return {
        success: false,
        error: 'Verification failed'
      }
    }
  }

  static async generateNonce(): Promise<string> {
    // Generate a random nonce
    return ethers.hexlify(ethers.randomBytes(16))
  }

  static verifyToken(token: string): { success: boolean; user?: any; error?: string } {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any
      return {
        success: true,
        user: {
          address: decoded.address,
          chainId: decoded.chainId,
          nonce: decoded.nonce
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Invalid token'
      }
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }

  static generateToken(user: any): string {
    return jwt.sign(
      {
        address: user.address,
        chainId: user.chainId,
        nonce: user.nonce
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    )
  }
}
