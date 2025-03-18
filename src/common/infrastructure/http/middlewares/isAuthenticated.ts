import { UnauthorizedError } from '@/common/domain/errors/unauthorized-error'
import { NextFunction, Request, Response } from 'express'
import { AuthTokenProviderJsonwebtoken } from '../../providers/auth-token-provider.jsonwebtoken'

export function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    throw new UnauthorizedError('Token is missing')
  }

  const [, access_token] = authHeader.split(' ')
  const authTokenProvider = new AuthTokenProviderJsonwebtoken()

  const { user_id } = authTokenProvider.verifyAuthToken(access_token)

  if (!user_id) {
    throw new UnauthorizedError('Invalid token')
  }

  req.user = {
    id: user_id,
  }

  return next()
}
