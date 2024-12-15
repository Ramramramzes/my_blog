import express, { json } from 'express'
import { createPoolConnection } from '../src/common/common.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import { generateTokens, tokenTimeParser } from '../src/common/common.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config();
const app = express();
const port = process.env.AUTH_PORT;

//! Функции для auth с бд ==========================>>>>>>>>
async function writeRefreshToBD (userId, tokens) {
  
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
  
  const values = [userId, tokens, tokenTimeParser()];

  try {
    const result = await pool.query(refreshCreateQuery, values);
  } catch (error) {
    console.error('Ошибка при записи refresh токена в БД:', error);
  }
};

export const authenticateToken = async (req,res) => {
  const authHeader = req.headers['authorization'];  
  
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) throw new Error('Нет access токена');

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          const refreshToken = req.cookies.refreshToken;

          if (!refreshToken) {
            reject(new Error('Нет refresh токена'));
            return;
          }

          try {
            const result = await pool.query(
              'SELECT * FROM tokens WHERE refresh_token = $1 AND is_active = true',
              [refreshToken]
            );

            const tokenRecord = result.rows[0];
            if (!tokenRecord || new Date(tokenRecord.expires_at) < new Date()) {
              reject(new Error('Рефреш токен протух'));
              return;
            }
            
            const newTokens = generateTokens({id: tokenRecord.user_id, email: tokenRecord.email});
            await writeRefreshToBD(tokenRecord.user_id, newTokens.refreshToken);

            req.newRefreshToken = newTokens.refreshToken;
            resolve(newTokens.accessToken); // Возвращаем новый accessToken
          } catch (error) {
            console.error('Ошибка при проверке refresh токена:', error);
            reject(new Error('Ошибка при проверке refresh токена'));
          }
        } else {
          reject(new Error('Невалидный access токен'));
        }
      } else {
        resolve(token);
      }
    });
  });
};

//! Функции для auth с бд ==========================>>>>>>>>

app.use(cors({
  origin: process.env.CORSE_URL,
  credentials: true,
}));

app.use(json());
app.use(cookieParser());

const pool = createPoolConnection();

app.post('/addUser', async (req, res) => {
  const { username, password, email } = req.body;
  const userId = uuidv4();
  const createdAt = new Date();
  
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query(
      'INSERT INTO users (user_id,username,email,password,created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [userId, username, email, hashedPassword, createdAt]
    );
    
    const tokens = generateTokens({id:userId, email:email})
    await writeRefreshToBD(userId, tokens.refreshToken)
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: tokens.accessToken, userId: userId });

  } catch (error) {
    if (error.code === '23505') {
      res.status(400).send({status: 400, message:'Пользователь с таким логином или email уже существует'});
    } else {
      res.status(500).send({status: 500, message:'Ошибка сервера'});
    }
  }
});

app.post('/login-user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).send({status: 401, message:'Пользователь не найден'});
      return;
    }

    const user = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      res.status(401).send({status: 401, message:'Неверный пароль'});
      return;
    }else{
      const tokens = generateTokens({id:user.user_id, email:user.email})
      await writeRefreshToBD(user.user_id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000
      });
      return res.json({ accessToken: tokens.accessToken, userId: user.user_id });
    }
  } catch (error) {
    res.status(500).send({status: 500, message:'Ошибка сервера'});
  }
})

app.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Токен не найден в куках' });
  }

  try {
    const deleteQuery = `
      DELETE FROM tokens
      WHERE refresh_token = $1;
    `;

    const result = await pool.query(deleteQuery, [refreshToken]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Токен не найден в базе данных' });
    }

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

app.post('/refresh-token', async (req, res) => {
  try {
    const newAccessToken = await authenticateToken(req);

    if (req.newRefreshToken) {
      res.cookie('refreshToken', req.newRefreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    
    res.json({ accessToken: newAccessToken, userId:jwt.decode(newAccessToken).id});
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error.message);
    res.status(403).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на BASE_URL:AUTH_PORT`);
});