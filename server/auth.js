import express, { json } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { generateTokens, tokenTimeParser } from '../src/common/common.js';
import jwt from 'jsonwebtoken';
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


//! Функция для записи Refresh-токена в БД ==========================>>>>>>>>
async function writeRefreshToBD(userId, refresh) {
  const refreshCreateQuery = `
    INSERT INTO tokens (user_id, refresh_token, expires_at, created_at, is_active)
    VALUES ($1, $2, $3, NOW(), true)
    ON CONFLICT (user_id) 
    DO UPDATE 
    SET refresh_token = $2, 
        expires_at = $3, 
        created_at = NOW(), 
        is_active = true;
  `;
  
  const values = [userId, refresh, tokenTimeParser()];

  try {
    await queryDB(refreshCreateQuery, values);
  } catch (error) {
    console.error('Ошибка при записи refresh-токена в БД:', error);
  }
}

//! Middleware для проверки Access-токена и автоматического обновления ==========================>>>>>>>>
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Нет токена' });

  const accessToken = authHeader.split(' ')[1];

  jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err) {
      req.user = decoded;
      req.tokens = {accessToken: accessToken, refreshToken: req.cookies.refreshToken}
      return next();
    }

    if (err.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: 'Нет refresh-токена' });

      try {
        const result = await queryDB(
          'SELECT user_id FROM tokens WHERE refresh_token = $1 AND is_active = true',
          [refreshToken]
        );

        if (result.data.length === 0) return res.status(403).json({ message: 'Refresh-токен не найден' });

        jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decodedRT) => {
          if (err) return res.status(403).json({ message: 'Refresh-токен недействителен' });
          
          const newTokens = generateTokens({id: decodedRT.id, email: decodedRT.email})

          res.setHeader('Authorization', `Bearer ${newTokens.accessToken}`); // Отправляем новый AT

          await writeRefreshToBD(decodedRT.id, newTokens.refreshToken);

          res.cookie('refreshToken', newTokens.refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
          });
          req.user = decodedRT;
          next();
        });
      } catch (error) {
        return res.status(500).json({ message: 'Ошибка сервера' });
      }
    } else {
      return res.status(401).json({ message: 'Токен недействителен' });
    }
  });
};

//? Функция для проверки доступа по токенам ==========================>>>>>>>>
export const authMiddleware = async (req, res, next) => {
  try {
    await authenticateToken(req, res, next);
  } catch (error) {
    console.error('Ошибка проверки токена:', error.message);
    res.status(403).json({ message: 'Неавторизован' });
  }
};

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
  console.log(`Сервер работает на ${port}`);
});