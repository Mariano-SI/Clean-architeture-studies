import { Pool } from 'pg'
import { env } from '../env'

const pool = new Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  port: Number(env.DB_PORT) || 5432,
  max: 100,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export default pool
