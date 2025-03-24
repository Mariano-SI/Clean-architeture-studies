import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { UsersRepositoryPG } from '../../database/user.repository.pg'
import { UserTokensRepositoryPG } from '../../database/user-tokens.repository.pg'
import { SendEmailToResetPasswordUsecase } from '@/users/application/usecases/send-email-to-reset-password.usecase'

export async function sendEmailToResetPasswordController(
  req: Request,
  res: Response,
) {
  const sendEmailToResetPasswordBodySchema = z.object({
    email: z.string().email('Invalid email').nonempty('Email is required'),
  })

  const validBody = sendEmailToResetPasswordBodySchema.safeParse(req.body)

  if (!validBody.success) {
    throw new BadRequestError(
      `${validBody.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const { email } = validBody.data

  const usersRepository = UsersRepositoryPG.getInstance()
  const userTokensRepository = UserTokensRepositoryPG.getInstance()
  const sendEmailToResetPasswordController =
    new SendEmailToResetPasswordUsecase(usersRepository, userTokensRepository)

  const userToken = await sendEmailToResetPasswordController.execute({ email })

  return res.status(200).json(userToken)
}
