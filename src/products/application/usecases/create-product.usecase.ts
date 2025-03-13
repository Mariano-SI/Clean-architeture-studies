import { ConflictError } from '@/common/domain/errors/conflict-error'
import { ProductsRepository } from '@/products/domain/repositories/products.repository'

export type Input = {
  name: string
  price: number
  quantity: number
}

export type Output = {
  id: string
  name: string
  price: number
  quantity: number
  created_at: Date
  updated_at: Date
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const { name, price, quantity } = input

    const productAlreadyExists = await this.productRepository.findByName(name)

    if (productAlreadyExists) {
      throw new ConflictError(
        'An product with the provided name already exists',
      )
    }

    const createdProduct = await this.productRepository.create({
      name,
      price,
      quantity,
    })

    return createdProduct
  }
}
