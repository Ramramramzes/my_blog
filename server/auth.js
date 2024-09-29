import express, { json } from 'express'
import { createPoolConnection } from '../src/common/common.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'

const app = express();
const port = process.env.AUTH_PORT;

app.use(json());
const pool = createPoolConnection();

app.post('/addUser', async (req, res) => {
  const { username, password, repeated, email } = req.body;
  const userId = uuidv4();
  const createdAt = new Date();
  
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      'INSERT INTO users (user_id,username,email,password,created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [userId, username, email, hashedPassword, createdAt]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка записи в базу данных:', error);

    if (error.code === '23505') {
      res.status(400).send('Пользователь с таким логином или email уже существует');
    } else {
      res.status(500).send('Ошибка сервера');
    }
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
