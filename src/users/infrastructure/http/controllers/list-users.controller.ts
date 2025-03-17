import { BadRequestError } from '@/common/domain/errors/bad-reques-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { UsersRepositoryPG } from '../../database/user.repository.pg'
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase'

export async function listUsersController(
  req: Request,
  res: Response,
): Promise<Response> {
  const listProductsQueryParamsSchema = z.object({
    page: z.coerce
      .number()
      .positive('Page must be a positive number')
      .optional(),
    per_page: z.coerce
      .number()
      .positive('Per page must be a positive number')
      .optional(),
    sort: z.string().optional(),
    sort_dir: z.enum(['asc', 'desc']).optional(),
    filter: z.string().optional(),
  })

  const validQueryParams = listProductsQueryParamsSchema.safeParse(req.query)

  if (!validQueryParams.success) {
    throw new BadRequestError(
      `${validQueryParams.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const params = validQueryParams.data

  const usersRepository = UsersRepositoryPG.getInstance()
  const listUsersUsecase = new ListUsersUseCase(usersRepository)

  const users = await listUsersUsecase.execute(params)

  res.header('Total-Count', users.total.toString())
  delete users.total
  return res.status(200).json(users)
}
