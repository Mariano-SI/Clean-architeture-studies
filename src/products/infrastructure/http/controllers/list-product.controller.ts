import { BadRequestError } from '@/common/domain/errors/bad-reques-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductRepositoryPG } from '../../database/product.repository.pg'
import { ListProductUsecase } from '@/products/application/usecases/list-product.usecase'

export async function listProductController(
  req: Request,
  res: Response,
): Promise<Response> {
  const listProductParamsSchema = z.object({
    id: z.string().uuid('O ID deve ser um UUID válido'),
  })

  const validatedData = listProductParamsSchema.safeParse(req.params)

  if (!validatedData.success) {
    throw new BadRequestError(
      `${validatedData.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const { id } = validatedData.data

  const productRepository = ProductRepositoryPG.getInstance()
  const listProductUsecase = new ListProductUsecase(productRepository)

  const product = await listProductUsecase.execute({ id })

  return res.status(200).json(product)
}
