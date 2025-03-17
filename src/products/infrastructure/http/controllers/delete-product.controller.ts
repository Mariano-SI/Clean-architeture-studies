import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductRepositoryPG } from '../../database/product.repository.pg'
import { DeleteProductUsecase } from '@/products/application/usecases/delete-product.usecase'

export async function deleteProductController(
  req: Request,
  res: Response,
): Promise<Response> {
  const deleteProductParamsSchema = z.object({
    id: z.string().uuid('O ID deve ser um UUID válido'),
  })

  const validParams = deleteProductParamsSchema.safeParse(req.params)

  if (!validParams.success) {
    throw new BadRequestError(
      `${validParams.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const { id } = validParams.data

  const productsRepository = ProductRepositoryPG.getInstance()
  const deleteProductUsecase = new DeleteProductUsecase(productsRepository)

  await deleteProductUsecase.execute({ id })

  return res.status(204).send()
}
