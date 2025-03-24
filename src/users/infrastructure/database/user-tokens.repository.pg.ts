import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository-interface'
import { UserTokensModel } from '@/users/domain/models/user-tokens.model'
import {
  CreateUserTokensProps,
  UserTokensRepository,
} from '@/users/domain/repositories/user-tokens.repository'
import { userTokensQueries } from './user-tokens.queries'
import { pool } from '@/common/infrastructure/database'

export class UserTokensRepositoryPG implements UserTokensRepository {
  private static instance: UserTokensRepositoryPG

  static getInstance(): UserTokensRepositoryPG {
    if (!UserTokensRepositoryPG.instance) {
      UserTokensRepositoryPG.instance = new UserTokensRepositoryPG()
    }
    return UserTokensRepositoryPG.instance
  }

  async findByToken(token: string): Promise<UserTokensModel> {
    const query = userTokensQueries.FIND_BY_TOKEN
    const { rows } = await pool.query(query, [token])
    return rows.length ? rows[0] : null
  }

  async create(props: CreateUserTokensProps): Promise<UserTokensModel> {
    const { user_id } = props
    const query = userTokensQueries.CREATE
    const { rows } = await pool.query(query, [user_id])
    return rows[0]
  }

  async findById(id: string): Promise<UserTokensModel> {
    const query = userTokensQueries.FIND_BY_ID
    const { rows } = await pool.query(query, [id])
    return rows.length ? rows[0] : null
  }

  async update(model: UserTokensModel): Promise<UserTokensModel> {
    const { id, user_id } = model
    const fieldsToUpdate: string[] = []
    const values: (string | number)[] = []

    values.push(id)

    if (user_id) {
      fieldsToUpdate.push(`user_id = $${values.length + 1}`)
      values.push(user_id)
    }

    if (fieldsToUpdate.length === 0) {
      return await this.findById(id)
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')
      await client.query(
        'SELECT * FROM user_tokens WHERE id = $1 FOR UPDATE;',
        [id],
      )

      const query = userTokensQueries.UPDATE(fieldsToUpdate)
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
    const query = userTokensQueries.DELETE
    await pool.query(query, [id])
    return
  }
  async selectAll(props: SearchInput): Promise<SearchOutput<UserTokensModel>> {
    throw new Error('Method not implemented)')
  }
}
