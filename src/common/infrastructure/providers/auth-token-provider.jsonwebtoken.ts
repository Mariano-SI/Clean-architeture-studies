import {
  VerifyAuthKeyProps,
  AuthTokenProvider,
  GeneratedToken,
} from '@/common/domain/providers/auth-token-provider'
import { env } from '../env'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '@/common/domain/errors/unauthorized-error'

export class AuthTokenProviderJsonwebtoken implements AuthTokenProvider {
  generateAuthToken(userId: string): GeneratedToken {
    const access_token = jwt.sign({}, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      subject: userId,
    })

    return { access_token }
  }

  verifyAuthToken(token: string): VerifyAuthKeyProps {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      const { sub } = decodedToken as { sub: string }
      return { user_id: sub }
    } catch {
      throw new UnauthorizedError('Invalid token')
    }
  }
}
