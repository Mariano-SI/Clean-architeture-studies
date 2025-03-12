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

//revisar isso
export class ProductRepositoryPG implements ProductsRepository {
  async create(props: CreateProductProps): Promise<ProductModel> {
    const query = `
      INSERT INTO products ( name, price, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `

    const values = [props.name, props.price, props.quantity]

    const { rows } = await pool.query(query, values)
    return rows[0]
  }

  async insert(model: ProductModel): Promise<ProductModel> {
    return this.create(model)
  }

  async findById(id: string): Promise<ProductModel> {
    const query = `SELECT * FROM products WHERE id = $1`
    const { rows } = await pool.query(query, [id])
    return rows.length ? rows[0] : null
  }

  async findByName(name: string): Promise<ProductModel> {
    const query = `SELECT * FROM products WHERE name = $1`
    const { rows } = await pool.query(query, [name])
    return rows.length ? rows[0] : null
  }

  async findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
    const ids = productIds.map(p => p.id)
    const query = `SELECT * FROM products WHERE id = ANY($1)`
    const { rows } = await pool.query(query, [ids])
    return rows
  }

  async update(model: ProductModel): Promise<ProductModel> {
    const query = `
      UPDATE products
      SET name = $1, price = $2, quantity = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `

    const values = [model.name, model.price, model.quantity, model.id]

    const { rows } = await pool.query(query, values)
    return rows.length ? rows[0] : null
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM products WHERE id = $1`
    await pool.query(query, [id])
  }

  async search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    const {
      page = 1,
      per_page = 10,
      sort = 'created_at',
      sort_dir = 'desc',
      filter,
    } = props

    let whereClause = ''
    const values: any[] = []

    if (filter) {
      whereClause = `WHERE name ILIKE $1 OR CAST(price AS TEXT) ILIKE $1`
      values.push(`%${filter}%`)
    }

    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`
    const totalResult = await pool.query(countQuery, values)
    const total = parseInt(totalResult.rows[0].count, 10)

    const offset = (page - 1) * per_page
    const query = `
      SELECT * FROM products ${whereClause}
      ORDER BY ${sort} ${sort_dir.toUpperCase()}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `

    values.push(per_page, offset)

    const { rows } = await pool.query(query, values)

    return {
      items: rows,
      per_page,
      total,
      current_page: page,
      sort,
      sort_dir,
      filter,
    }
  }
}
