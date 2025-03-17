import { BadRequestError } from '@/common/domain/errors/bad-reques-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { UsersRepositoryPG } from '../../database/user.repository.pg'
import { CreateUserUsecase } from '@/users/application/usecases/create-user.usecase'
import { HashProviderBcryptjs } from '@/common/infrastructure/providers/hash-provider.bcryptjs'

export class CreateUserController {
  async execute(req: Request, res: Response): Promise<Response> {
    const createUserBodySchema = z.object({
      name: z.string().nonempty('Name is required'),
      email: z.string().email('Email must be valid'),
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

    const validBody = createUserBodySchema.safeParse(req.body)

    if (!validBody.success) {
      throw new BadRequestError(
        `${validBody.error.errors.map(error => {
          return `${error.path} -> ${error.message}`
        })}`,
      )
    }

    const { name, email, password } = validBody.data

    const userRepositoty = new UsersRepositoryPG()
    const hashProvider = new HashProviderBcryptjs()
    const createUserUsecase = new CreateUserUsecase(
      userRepositoty,
      hashProvider,
    )
    const createdUser = await createUserUsecase.execute({
      name,
      email,
      password,
    })

    return res.status(201).json(createdUser)
  }
}
