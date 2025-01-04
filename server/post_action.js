import { v4 as uuidv4 } from 'uuid';

export const post_add = async(data, ws, pool) => {
  const post_id = uuidv4();
  if (!data.user_id || !data.post || typeof data.post !== 'string') {
    ws.send(JSON.stringify({ 
      action: 'post_add',
      data: {
        code: 400,
        message: 'Некорректные входные данные. Проверьте user_id и content.'
      }
    }));
  }

  try {
    const response = await pool.query(
      `INSERT INTO posts (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [post_id,  data.user_id , data.post]
    );

    if (response.rowCount > 0) {
      ws.send(JSON.stringify({ 
        action: 'post_add',
        data: {
          code: 200 
        }
      }));
    }
  }
  catch (error) {
    console.error('Ошибка при сохранении поста:', error);
    
    if (error.code === '23505') {
      ws.send(JSON.stringify({
        action: 'post_add',
        data: {
          status: 'error',
          code: 409,
          message: 'Пост с таким ID уже существует',
        }
      }));
    } else {
      ws.send(JSON.stringify({
        action: 'post_add',
        data: {
          status: 'error',
          code: 500,
          message: 'Внутренняя ошибка сервера',
          details: error.message,
        }
      }));
    }
  }
}

export async function post_update(data, ws, pool) {
  if (!data.post_id || !data.post || !data.user_id || typeof data.post !== 'string') {
    ws.send(JSON.stringify({
      action: 'post_update',
      data: {
        status: 'error',
        code: 400,
        message: 'Некорректные входные данные. Проверьте post_id, user_id и content.',
      }
    }));
    return;
  }

  try {
    const ownerCheck = await pool.query(
      `SELECT post_id FROM posts WHERE post_id = $1 AND user_id = $2`,
      [data.post_id, data.user_id]
    );

    if (ownerCheck.rowCount === 0) {
      ws.send(JSON.stringify({
        action: 'post_update',
        data: {
          status: 'error',
          code: 403,
          message: 'Вы не имеете прав для редактирования этого поста.',
        }
      }));
      return;
    }

    const response = await pool.query(
      `UPDATE posts 
      SET content = $1
      WHERE post_id = $2 AND user_id = $3 
      RETURNING *`,
      [data.post, data.post_id, data.user_id]
    );

    if (response.rowCount > 0) {
      ws.send(JSON.stringify({
        action: 'post_update',
        data: {
          code: 200,
          message: 'Пост успешно обновлён.',
          post: response.rows[0],
        }
      }));
    } else {
      ws.send(JSON.stringify({
        action: 'post_update',
        data: {
          status: 'error',
          code: 404,
          message: 'Пост не найден.',
        }
      }));
    }
  } catch (error) {
    console.error('Ошибка при обновлении поста:', error);
    ws.send(JSON.stringify({
      action: 'post_update',
      data: {
        status: 'error',
        code: 500,
        message: 'Внутренняя ошибка сервера.',
        details: error.message,
      }
    }));
  }
}