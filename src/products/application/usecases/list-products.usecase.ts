import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { ProductOutputDto } from '../dtos/product-output.dto'

type Input = {
  page?: number
  per_page?: number
  sort?: string
  sort_dir?: string
  filter?: string
}

type Output = {
  items: ProductOutputDto[]
  per_page: number
  total: number
  current_page: number
  sort: string | null
  sort_dir: string | null
  filter: string | null
}

export class ListPorductsUsecase {
  constructor(private readonly productsRepository: ProductsRepository) {}
  async execute(input: Input): Promise<Output> {
    const searchResult = await this.productsRepository.selectAll(input)

    const formattedProducts: ProductOutputDto[] = searchResult.items.map(
      product => new ProductOutputDto(product),
    )

    return {
      items: formattedProducts,
      per_page: searchResult.per_page,
      current_page: searchResult.current_page,
      sort: searchResult.sort,
      sort_dir: searchResult.sort_dir,
      filter: searchResult.filter,
      total: searchResult.total,
    }
  }
}
