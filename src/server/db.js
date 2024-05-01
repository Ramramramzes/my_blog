import { createPool } from "mysql"

export const connection = createPool({
  connectionLimit: 30,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'my_blog',
})