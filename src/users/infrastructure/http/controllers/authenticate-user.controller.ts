import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { UsersRepositoryPG } from '../../database/user.repository.pg'
import { AuthenticateUserUsecase } from '@/users/application/usecases/authenticate-user.usecase'
import { HashProviderBcryptjs } from '@/common/infrastructure/providers/hash-provider.bcryptjs'
import { AuthTokenProviderJsonwebtoken } from '@/common/infrastructure/providers/auth-token-provider.jsonwebtoken'
import { access } from 'fs'

export async function authenticateUserController(
  req: Request,
  res: Response,
): Promise<Response> {
  const authenticateUserBodySchame = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const validBody = authenticateUserBodySchame.safeParse(req.body)

  if (!validBody.success) {
    throw new BadRequestError(
      `${validBody.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const { email, password } = validBody.data

  const userRepository = UsersRepositoryPG.getInstance()
  const hashProvider = new HashProviderBcryptjs()
  const authenticateUserUsecase = new AuthenticateUserUsecase(
    userRepository,
    hashProvider,
  )

  const user = await authenticateUserUsecase.execute({ email, password })

  const authTokenProvider = new AuthTokenProviderJsonwebtoken()

  const { access_token } = authTokenProvider.generateAuthToken(user.id)

  return res.status(200).json({
    access_token,
  })
}
