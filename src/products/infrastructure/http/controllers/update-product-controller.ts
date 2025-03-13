import { BadRequestError } from '@/common/domain/errors/bad-reques-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductRepositoryPG } from '../../database/product.repository.pg'
import { UpdateProducUsecase } from '@/products/application/usecases/update-product.usecase'

export async function updateProductController(
  req: Request,
  res: Response,
): Promise<Response> {
  const updateProductParamsSchema = z.object({
    id: z.string().uuid('O ID deve ser um UUID válido'),
  })

  const updatedProductBodySchema = z.object({
    name: z.string().optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    quantity: z
      .number()
      .positive('Quantity must be a positive number')
      .optional(),
  })

  const validParams = updateProductParamsSchema.safeParse(req.params)
  const validBody = updatedProductBodySchema.safeParse(req.body)

  if (!validParams.success) {
    throw new BadRequestError(
      `${validParams.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  if (!validBody.success) {
    throw new BadRequestError(
      `${validBody.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const requestInputs = {
    id: validParams.data.id,
    ...validBody.data,
  }

  const productsRepository = ProductRepositoryPG.getInstance()
  const updateProductUsecase = new UpdateProducUsecase(productsRepository)

  const updatedProduct = await updateProductUsecase.execute(requestInputs)

  return res.status(200).json(updatedProduct)
}
