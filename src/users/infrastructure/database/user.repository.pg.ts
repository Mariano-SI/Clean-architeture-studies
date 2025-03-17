import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository-interface'
import { UserModel } from '@/users/domain/models/users.model'
import {
  CreateUserProps,
  UsersRepository,
} from '../../domain/repositories/users.repository'
import { usersQueries } from './users.queries'
import { pool } from '@/common/infrastructure/database'

export class UsersRepositoryPG implements UsersRepository {
  private readonly sortableFields: string[] = ['name', 'email', 'created_at']
  private static instance: UsersRepositoryPG

  static getInstance(): UsersRepositoryPG {
    if (!UsersRepositoryPG.instance) {
      UsersRepositoryPG.instance = new UsersRepositoryPG()
    }
    return UsersRepositoryPG.instance
  }

  async findByName(name: string): Promise<UserModel> {
    const query = usersQueries.FIND_BY_NAME
    const { rows } = await pool.query(query, [name])
    return rows.length ? rows[0] : null
  }

  async findByEmail(email: string): Promise<UserModel> {
    const query = usersQueries.FIND_BY_EMAIL
    const { rows } = await pool.query(query, [email])
    return rows.length ? rows[0] : null
  }

  async create(props: CreateUserProps): Promise<UserModel> {
    const { name, email, password } = props
    const query = usersQueries.CREATE
    const { rows } = await pool.query(query, [name, email, password])
    return rows[0]
  }

  async findById(id: string): Promise<UserModel> {
    const query = usersQueries.FIND_BY_ID
    const { rows } = await pool.query(query, [id])
    return rows.length ? rows[0] : null
  }

  async update(model: UserModel): Promise<UserModel> {
    const { id, name, email, password, avatar } = model
    const fieldsToUpdate: string[] = []
    const values: (string | number)[] = []

    values.push(id)

    if (name) {
      fieldsToUpdate.push(`name = $${values.length + 1}`)
      values.push(name)
    }
    if (email) {
      fieldsToUpdate.push(`email = $${values.length + 1}`)
      values.push(email)
    }
    if (password) {
      fieldsToUpdate.push(`password = $${values.length + 1}`)
      values.push(password)
    }
    if (avatar) {
      fieldsToUpdate.push(`avatar = $${values.length + 1}`)
      values.push(avatar)
    }

    if (fieldsToUpdate.length === 0) {
      return await this.findById(id)
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')
      await client.query('SELECT * FROM users WHERE id = $1 FOR UPDATE;', [id])

      const query = usersQueries.UPDATE(fieldsToUpdate)
      const { rows } = await client.query(query, values)

      await client.query('COMMIT')

      return rows.length ? rows[0] : null
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async delete(id: string): Promise<void> {
    const query = usersQueries.DELETE
    await pool.query(query, [id])
    return
  }

  async selectAll(props: SearchInput): Promise<SearchOutput<UserModel>> {
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
      SELECT * FROM users
      ${whereClause}
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT $${values.length - 1} OFFSET $${values.length};
    `
    const totalQuery = `SELECT COUNT(*) FROM users ${whereClause};`

    const [totalResult, queryResult] = await Promise.all([
      pool.query(totalQuery, filter ? [values[0]] : []),
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
