import pool from '@/common/infrastructure/database/db'
import {
  ProductsRepository,
  ProductId,
  CreateProductProps,
} from '../../domain/repositories/products.repository'
import { ProductModel } from '../../domain/models/products.model'
import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository-interface'
import { productQueries } from './product.queries'

export class ProductRepositoryPG implements ProductsRepository {
  private readonly sortableFields: string[] = ['name', 'created_at']

  private static instance: ProductRepositoryPG

  static getInstance(): ProductRepositoryPG {
    if (!ProductRepositoryPG.instance) {
      ProductRepositoryPG.instance = new ProductRepositoryPG()
    }
    return ProductRepositoryPG.instance
  }

  async findByName(name: string): Promise<ProductModel> {
    const query = productQueries.FIND_BY_NAME
    const { rows } = await pool.query(query, [name])
    return rows.length ? rows[0] : null
  }

  async findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
    const allIds = productIds.map(productId => productId.id)
    const query = productQueries.FIND_ALL_BY_IDS
    const { rows } = await pool.query(query, [allIds])
    return rows
  }

  async create(props: CreateProductProps): Promise<ProductModel> {
    const { name, price, quantity } = props
    const query = productQueries.CREATE
    const { rows } = await pool.query(query, [name, price, quantity])
    return rows[0]
  }

  async findById(id: string): Promise<ProductModel> {
    const query = productQueries.FIND_BY_ID
    const { rows } = await pool.query(query, [id])
    return rows.length ? rows[0] : null
  }

  async update(model: ProductModel): Promise<ProductModel> {
    const { id, name, price, quantity } = model
    const query = productQueries.UPDATE
    const { rows } = await pool.query(query, [name, price, quantity, id])
    return rows.length ? rows[0] : null
  }

  async delete(id: string): Promise<void> {
    const query = productQueries.DELETE
    await pool.query(query, [id])
  }

  async selectAll(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    const {
      page = 1,
      per_page = 10,
      sort = 'created_at',
      sort_dir = 'desc',
      filter,
    } = props

    const orderBy = this.sortableFields.includes(sort) ? sort : 'created_at'
    const orderDirection = sort_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC'

    let whereClause = ''
    const values: any[] = []

    if (filter) {
      whereClause = `WHERE name ILIKE $1`
      values.push(`%${filter}%`)
    }

    const offset = (page - 1) * per_page
    values.push(per_page, offset)

    const query = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT $${values.length - 1} OFFSET $${values.length};
    `
    const totalQuery = `SELECT COUNT(*) FROM products ${whereClause};`

    const [totalResult, queryResult] = await Promise.all([
      pool.query(totalQuery, values),
      pool.query(query, values),
    ])

    const total = parseInt(totalResult.rows[0].count, 10)

    return {
      items: queryResult.rows,
      per_page,
      total,
      current_page: page,
      sort: orderBy,
      sort_dir: orderDirection,
      filter,
    }
  }
}
