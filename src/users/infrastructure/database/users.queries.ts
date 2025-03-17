export const usersQueries = {
  FIND_BY_ID: `SELECT * FROM users WHERE id = $1;`,
  FIND_BY_EMAIL: `SELECT * FROM users WHERE email = $1;`,
  FIND_BY_NAME: `SELECT * FROM users WHERE name = $1;`,
  CREATE: `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
  UPDATE: (fieldsToUpdate: string[]) => `UPDATE users
    SET ${fieldsToUpdate.join(', ')}, updated_at = NOW()
    WHERE id = $1
    RETURNING *;`,
  DELETE: `DELETE FROM users WHERE id = $1`,
}
