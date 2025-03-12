import pool from './db'
import dataSource from './typeorm'

export { pool, dataSource }

export async function checkDatabaseConnection() {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('✅ Banco de dados conectado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error)
    process.exit(1)
  }
}
