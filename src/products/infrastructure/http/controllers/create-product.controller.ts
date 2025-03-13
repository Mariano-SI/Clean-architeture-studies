import { BadRequestError } from '@/common/domain/errors/bad-reques-error'
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductRepositoryPG } from '../../database/product.repository.pg'

export async function createProductController(
  req: Request,
  res: Response,
): Promise<Response> {
  const createProductBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })

  const validatedData = createProductBodySchema.safeParse(req.body)

  if (!validatedData.success) {
    throw new BadRequestError(
      `${validatedData.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const { name, price, quantity } = validatedData.data
  const productsRepository = new ProductRepositoryPG()
  const createProductUsecase = new CreateProductUseCase(productsRepository)

  const createdProduct = await createProductUsecase.execute({
    name,
    price,
    quantity,
  })

  return res.status(201).json(createdProduct)
}
