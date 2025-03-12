import { DataSource } from 'typeorm'
import { env } from '../env'

const dataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: Number(env.DB_PORT) || 5432,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: false,
  logging: false,
  schema: env.DB_SCHEMA,
  migrationsTableName: 'migrations',
  migrations: ['**/migrations/**/*.ts'],
  entities: ['**/entities/**/*.ts'],
})

export default dataSource
