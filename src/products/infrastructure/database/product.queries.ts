export const productQueries = {
  FIND_BY_ID: `SELECT * FROM products WHERE id = $1;`,
  FIND_BY_NAME: `SELECT * FROM products WHERE name = $1;`,
  FIND_ALL_BY_IDS: `SELECT * FROM products WHERE id = ANY($1);`,
  CREATE: `INSERT INTO products (name, price, quantity) VALUES ($1, $2, $3) RETURNING *;`,
  UPDATE: `UPDATE products
    SET name = $1, price = $2, quantity = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING *;`,
  DELETE: `DELETE * FROM products WHERE id = $1`,
}
