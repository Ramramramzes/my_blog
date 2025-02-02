import { generateTokens, tokenTimeParser } from '../src/common/common.js';
import jwt from 'jsonwebtoken';
import { queryDB } from './queryDB.js';

//! Функция для записи Refresh-токена в БД ==========================>>>>>>>>
export async function writeRefreshToBD(userId, refresh) {
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
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Нет токена" });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = decoded;
      req.tokens = { accessToken, refreshToken: req.cookies.refreshToken };
      return next(); 
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        return res.status(401).json({ message: "Токен недействителен" });
      }
    }

    // Если мы здесь — `accessToken` истек, проверяем `refreshToken`
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Нет refresh-токена" });
    }

    const result = await queryDB(
      "SELECT user_id FROM tokens WHERE refresh_token = $1 AND is_active = true",
      [refreshToken]
    );

    if (result.data.length === 0) {
      return res.status(403).json({ message: "Refresh-токен не найден" });
    }

    let decodedRT;
    try {
      decodedRT = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Refresh-токен недействителен" });
    }

    const newTokens = generateTokens({ id: decodedRT.id, email: decodedRT.email });

    res.setHeader("Authorization", `Bearer ${newTokens.accessToken}`); // Отправляем новый AT
    await writeRefreshToBD(decodedRT.id, newTokens.refreshToken);

    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    req.user = decodedRT;
    req.tokens = { accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken };

    return next();
  } catch (error) {
    console.error("Ошибка в authenticateToken:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
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