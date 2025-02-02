import { createPoolConnection } from '../src/common/common.js';

const pool = createPoolConnection();

export const queryDB = async (query, params = []) => {
  try {
    const { rows } = await pool.query(query, params);
    return { success: true, data: rows, status: 200 };
  } catch (error) {
    console.error(`❌ Ошибка при выполнении запроса: ${error.message}`);

    let status = 500;
    let errorMessage = 'Ошибка сервера при выполнении запроса';

    switch (error.code) {
      case '23505': // Ошибка дубликата (например, email уникальный)
        status = 409;
        errorMessage = 'Пользователь с таким логином или почтой уже существует';
        break;
      case '23502': // Ошибка NOT NULL
        status = 400;
        errorMessage = 'Отсутствуют обязательные поля';
        break;
      case '42601': // Синтаксическая ошибка SQL
        status = 400;
        errorMessage = 'Ошибка в SQL-запросе';
        break;
      case '28P01': // Неверный пароль для БД
        status = 401;
        errorMessage = 'Ошибка аутентификации';
        break;
      case '42703': // Несуществующий столбец
        status = 400;
        errorMessage = 'Запрос содержит несуществующее поле';
        break;
      default:
        if (error.message.includes('permission denied')) {
          status = 403; // Ошибка прав доступа
          errorMessage = 'Доступ запрещен';
        }
    }

    return {
      success: false,
      error: errorMessage,
      details: error.message,
      status,
    };
  }
};