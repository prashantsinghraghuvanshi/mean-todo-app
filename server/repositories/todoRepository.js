const db = require('../config/db');

exports.getAllTodos = async (userId) => {
  const result = await db.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
};

exports.createTodo = async (userId, title) => {
  const result = await db.query(
    'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *',
    [title, userId]
  );
  return result.rows[0];
};

exports.deleteTodo = async (userId, todoId) => {
  const result = await db.query(
    'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
    [todoId, userId]
  );
  return result.rowCount > 0;
};

exports.updateTodo = async (userId, todoId, completed) => {
  const result = await db.query(
    'UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [completed, todoId, userId]
  );
  return result.rows[0];
};
