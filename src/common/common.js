import pkg from 'pg'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
const { Pool } = pkg;

dotenv.config();

export const BASE_URL = process.env.BASE_URL

export const createPoolConnection = () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  return pool;
}

export const generateTokens = (user) => {
  const payload = { id: user.id };
  if (user.email) {
    payload.email = user.email;
  }

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
  return { accessToken, refreshToken };
};
// req.cookies
export const tokenTimeParser = () => {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;
  const timeFormat = expiresIn[expiresIn.length - 1];
  const num = parseInt(expiresIn)
  let finalTime
  switch(timeFormat) {
    case 'h':
      finalTime = num * 60 * 60 * 1000
      break
    case 'm':
      finalTime = num * 60 * 1000
      break
    case 's':  
      finalTime = num * 1000
    default:
      throw new Error('Неправильный формат времени');
  }
  const currentDate = new Date();
  return new Date(currentDate.getTime() + Number(finalTime)); 
}