import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ProductsRepository } from '@/products/domain/repositories/products.repository'

export type Input = {
  id: string
}

export type Output = {
  id: string
  name: string
  price: number
  quantity: number
  created_at: Date
  updated_at: Date
}

export class ListProductUsecase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const { id } = input
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }
  }
}
