import { BadRequestError } from '@/common/domain/errors/bad-reques-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductRepositoryPG } from '../../database/product.repository.pg'
import { ListProductsUsecase } from '@/products/application/usecases/list-products.usecase'

export async function listProductsController(
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

  const productsRepository = ProductRepositoryPG.getInstance()
  const listProductsUsecase = new ListProductsUsecase(productsRepository)

  const products = await listProductsUsecase.execute(params)

  res.header('Total-Count', products.total.toString())
  delete products.total
  return res.status(200).json(products)
}
