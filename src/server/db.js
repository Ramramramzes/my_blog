import { createPool } from "mysql"

export const connection = createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'my_blog',
})