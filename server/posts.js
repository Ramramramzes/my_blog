import express, { json } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { generateTokens, tokenTimeParser } from '../src/common/common.js';
import jwt from 'jsonwebtoken';
import { queryDB } from './queryDB.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './auth_functions.js';
import { getPaginationParams } from './posts_functions.js';
;

dotenv.config();
const app = express();
const port = process.env.POSTS_PORT;

app.use(cors({
  origin: process.env.CORSE_URL,
  credentials: true,
}));

app.use(json());
app.use(cookieParser());

app.get("/get-all-posts", authMiddleware, async (req, res) => {
  try {
    const { size, offset } = getPaginationParams(req.query);
    
    const response = await queryDB("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2", [size, offset]);

    res.json(response.data);
  } catch (err) {
    console.error("Ошибка при получении постов:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/get-user-posts", authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "user_id обязателен" });
    }

    const { size, offset } = getPaginationParams(req.query);

    const response = await queryDB(
      "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [user_id, size, offset]
    );

    res.json(response.data);
  } catch (err) {
    console.error("Ошибка при получении постов:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const { user_id, username, content } = req.body;
    const post_id = uuidv4();


    if (!content) {
      return res.status(400).json({ message: "title и content обязательны" });
    }

    const created_at = new Date();

    const response = await queryDB(
      "INSERT INTO posts (post_id, user_id, content, created_at, username) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [post_id, user_id, content, created_at, username]
    );

    res.status(201).json({ message: "Пост добавлен", post: response.data[0] });
  } catch (err) {
    console.error("Ошибка при добавлении поста:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.patch("/edit-post/:post_id", authMiddleware, async (req, res) => {
  try {
    const { post_id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id; // ID из токена

    if (!content) {
      return res.status(400).json({ message: "content обязателен" });
    }

    // Проверяем, является ли пользователь владельцем поста
    const checkPost = await queryDB("SELECT user_id FROM posts WHERE post_id = $1", [post_id]);

    if (checkPost.data.length === 0) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    if (checkPost.data[0].user_id !== user_id) {
      
      return res.status(403).json({ message: "Нет прав на редактирование" });
    }

    // Обновляем пост
    const response = await queryDB(
      "UPDATE posts SET content = $1 WHERE post_id = $2 RETURNING *",
      [content, post_id]
    );

    res.status(200).json({ message: "Пост обновлен", post: response.data[0] });
  } catch (err) {
    console.error("Ошибка при редактировании поста:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.delete("/delete-post/:post_id", authMiddleware, async (req, res) => {
  try {
    const { post_id } = req.params;
    const user_id = req.user.id; // ID из токена

    // Проверяем, является ли пользователь владельцем поста
    const checkPost = await queryDB("SELECT user_id FROM posts WHERE post_id = $1", [post_id]);

    if (checkPost.data.length === 0) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    if (checkPost.data[0].user_id !== user_id) {
      return res.status(403).json({ message: "Нет прав на удаление" });
    }

    await queryDB("DELETE FROM posts WHERE post_id = $1", [post_id]);

    res.status(200).json({ message: "Пост удален" });
  } catch (err) {
    console.error("Ошибка при удалении поста:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

//! Запуск сервера ==========================>>>>>>>>
app.listen(port, () => {
  console.log(`Сервер posts работает на ${port}`);
});