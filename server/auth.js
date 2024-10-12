import express, { json } from 'express'
import { createPoolConnection } from '../src/common/common.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import { generateTokens, tokenTimeParser } from '../src/common/common.js';
import jwt from 'jsonwebtoken'

import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
const port = process.env.AUTH_PORT;

app.use(cors({
  origin: 'http://localhost:5173',
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

    res.json({ accessToken: tokens.accessToken });

  } catch (error) {
    if (error.code === '23505') {
      res.status(400).send({status: 400, message:'Пользователь с таким логином или email уже существует'});
    } else {
      res.status(500).send({status: 500, message:'Ошибка сервера'});
    }
  }
});

app.post('/login', async (req, res) => {
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
      const tokens = generateTokens({id:user.id, email:user.email})
      await writeRefreshToBD(user.user_id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000
      });
      return res.json({ accessToken: tokens.accessToken });
    }
  } catch (error) {
    res.status(500).send({status: 500, message:'Ошибка сервера'});
  }
})

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});

//! Функции для auth с бд
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
    console.log(result);
  } catch (error) {
    console.error('Ошибка при записи refresh токена в БД:', error);
  }
};

//? authenticateToken проверяет жив ли access
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) return res.sendStatus(403);

        try {
          const result = await pool.query(
            'SELECT * FROM tokens WHERE refresh_token = $1 AND is_active = true',
            [refreshToken]
          );

          const tokenRecord = result.rows[0];
          if (!tokenRecord || new Date(tokenRecord.expires_at) < new Date()) {
            return res.sendStatus(403);
          }

          const newTokens = generateTokens({ id: tokenRecord.user_id });
          await writeRefreshToBD(tokenRecord.user_id, newTokens.refreshToken);

          res.cookie('refreshToken', newTokens.refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
          });
          
          return res.json({ accessToken: newTokens.accessToken });
        } catch (error) {
          console.error('Ошибка при проверке refresh токена:', error);
          return res.sendStatus(500);
        }
      } else {
        return res.sendStatus(403);
      }
    }
    next();
  });
};