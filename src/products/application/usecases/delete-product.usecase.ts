import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ProductsRepository } from '@/products/domain/repositories/products.repository'

type Input = {
  id: string
}

export class DeleteProductUsecase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(input: Input): Promise<void> {
    const { id } = input

    const product = await this.productsRepository.findById(id)

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    await this.productsRepository.delete(id)
  }
}
