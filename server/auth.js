import express, { json } from 'express'
import { createPoolConnection } from '../src/common/common.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import { generateTokens, authenticateToken,tokenTimeParser } from '../src/common/common.js';

const app = express();
const port = process.env.AUTH_PORT;

app.use(json());
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
    res.json(tokens);
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
      return res.json(tokens);
    }
  } catch (error) {
    res.status(500).send({status: 500, message:'Ошибка сервера'});
  }
})

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});

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

app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Вы получили доступ к защищенному маршруту!', user: req.user });
});