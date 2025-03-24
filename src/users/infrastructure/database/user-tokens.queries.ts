export const userTokensQueries = {
  FIND_BY_TOKEN: `SELECT * FROM user_tokens WHERE token = $1;`,
  CREATE: `INSERT INTO user_tokens (user_id) VALUES ($1) RETURNING *;`,
  FIND_BY_ID: `SELECT * FROM user_tokens WHERE id = $1;`,

  UPDATE(fields: string[]): string {
    return `UPDATE user_tokens SET ${fields.join(', ')} WHERE id = $1 RETURNING *;`
  },
  DELETE: `DELETE FROM user_tokens WHERE id = $1;`,
}
