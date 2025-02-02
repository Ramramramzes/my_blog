import express, { json } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { generateTokens } from '../src/common/common.js';
import { writeRefreshToBD, authMiddleware } from './auth_functions.js'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { queryDB } from './queryDB.js';

dotenv.config();
const app = express();
const port = process.env.AUTH_PORT;

app.use(cors({
  origin: process.env.CORSE_URL,
  credentials: true,
}));

app.use(json());
app.use(cookieParser());


//! Регистрация пользователя ==========================>>>>>>>>
app.post('/add-user', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const userId = uuidv4();
    const createdAt = new Date();

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await queryDB(
      'INSERT INTO users (user_id, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, username, email, hashedPassword, createdAt]
    );

    if (!result.success) {
      console.error(`❌ Ошибка при добавлении пользователя: ${result.error} | Details: ${result.details}`);
      return res.status(result.status).json({ message: result.error, details: result.details });
    }

    const tokens = generateTokens({ id: userId, email: email });
    await writeRefreshToBD(userId, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken: tokens.accessToken, userId });

  } catch (err) {
    console.error('🔥 Ошибка в /add-user:', err);
    return res.status(500).json({ message: 'Ошибка сервера', details: err.message });
  }
});

//! Логин пользователя ==========================>>>>>>>>
app.post('/login-user', async (req, res) => {
  const { email, password } = req.body;

  const result = await queryDB('SELECT * FROM users WHERE email = $1', [email]);
  
  if (result.data.length === 0) {
    return res.status(401).json({ message: 'Пользователь не найден' });
  }

  const user = result.data[0];
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Неверный пароль' });
  }

  const tokens = generateTokens({ id: user.user_id, email: user.email });
  await writeRefreshToBD(user.user_id, tokens.refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({ accessToken: tokens.accessToken, userId: user.user_id });
});

//! Logout ==========================>>>>>>>>
app.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(400).json({ message: 'Токен не найден в куках' });

  try {
    await queryDB('DELETE FROM tokens WHERE refresh_token = $1', [refreshToken]);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'Strict',
    });

    res.status(200).send();
  } catch (error) {
    console.error('Ошибка при выходе из системы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

//! Получение пользователя ==========================>>>>>>>>
app.get('/get-user', authMiddleware, async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id является обязательным параметром' });
  }

  const response = await queryDB('SELECT * FROM users WHERE user_id = $1', [user_id]);
  
  if (response.data.length === 0) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.json(response.data[0]);
});

//! Запуск сервера ==========================>>>>>>>>
app.listen(port, () => {
  console.log(`Сервер auth работает на ${port}`);
});