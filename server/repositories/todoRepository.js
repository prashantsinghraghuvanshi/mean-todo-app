const db = require('../config/db');

exports.getAllTodos = async (userId) => {
  const result = await db.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
};

exports.createTodo = async (userId, title, description, due_date) => {
  const result = await db.query(
    'INSERT INTO todos (title, description, due_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description || null, due_date || null, userId]
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

exports.updateTodo = async (userId, todoId, updates) => {
  const { completed, title, description, due_date } = updates;
  
  // Build dynamic update query based on provided fields
  const fields = [];
  const values = [userId, todoId];
  let paramCount = 2;
  
  if (completed !== undefined) {
    paramCount++;
    fields.push(`completed = $${paramCount}`);
    values.push(completed);
  }
  if (title !== undefined) {
    paramCount++;
    fields.push(`title = $${paramCount}`);
    values.push(title);
  }
  if (description !== undefined) {
    paramCount++;
    fields.push(`description = $${paramCount}`);
    values.push(description || null);
  }
  if (due_date !== undefined) {
    paramCount++;
    fields.push(`due_date = $${paramCount}`);
    values.push(due_date || null);
  }
  
  if (fields.length === 0) {
    // No fields to update, just return the todo
    const result = await db.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [todoId, userId]
    );
    return result.rows[0];
  }
  
  const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`;
  const result = await db.query(query, [todoId, userId, ...values.slice(2)]);
  return result.rows[0];
};
