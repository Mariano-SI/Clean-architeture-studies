import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ConflictError } from '@/common/domain/errors/conflict-error'

type Input = {
  id: string
  name?: string
  price?: number
  quantity?: number
}

type Output = {
  id: string
  name: string
  price: number
  quantity: number
  created_at: Date
  updated_at: Date
}

export class UpdateProducUsecase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute(input: Input): Promise<Output> {
    const { id, name, price, quantity } = input

    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    const fieldsToUpdate: Input = { id }

    if (name) {
      fieldsToUpdate.name = name
      const productAlreadyExists = await this.productRepository.findByName(name)
      if (productAlreadyExists) {
        throw new ConflictError(
          'An product with the provided name already exists',
        )
      }
    }

    if (price) fieldsToUpdate.price = price

    if (quantity) fieldsToUpdate.quantity = quantity

    const updatedProduct = await this.productRepository.update({
      ...product,
      ...fieldsToUpdate,
    })

    return updatedProduct
  }
}
