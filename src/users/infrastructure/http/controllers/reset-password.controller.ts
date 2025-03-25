import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { UsersRepositoryPG } from '../../database/user.repository.pg'
import { HashProviderBcryptjs } from '@/common/infrastructure/providers/hash-provider.bcryptjs'
import { ResetPasswordUsecase } from '@/users/application/usecases/reset.password.usecase'
import { UserTokensRepositoryPG } from '../../database/user-tokens.repository.pg'

export async function resetPasswordController(
  req: Request,
  res: Response,
): Promise<Response> {
  const resetPasswordUserBodySchema = z.object({
    token: z.string().uuid().nonempty('Token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
  })

  const validBody = resetPasswordUserBodySchema.safeParse(req.body)

  if (!validBody.success) {
    throw new BadRequestError(
      `${validBody.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const { token, password } = validBody.data

  const userRepositoty = UsersRepositoryPG.getInstance()
  const userTokensRepository = UserTokensRepositoryPG.getInstance()
  const hashProvider = new HashProviderBcryptjs()
  const resetPasswordUsecase = new ResetPasswordUsecase(
    userRepositoty,
    userTokensRepository,
    hashProvider,
  )
  await resetPasswordUsecase.execute({
    token,
    password,
  })

  return res.status(204).send()
}
