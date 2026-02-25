
const todoService = require('../services/todoService');

exports.getAllTodos = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }
  const todos = await todoService.getAllTodos(userId);
  res.json(todos);
};

exports.createTodo = async (req, res) => {
  const { userId, title, description, due_date } = req.body;
  if (!userId || !title) {
    return res.status(400).json({ message: 'Missing userId or title' });
  }
  try {
    const todo = await todoService.createTodo(userId, title, description, due_date);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create todo', error: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const userId = req.body.userId;
    const todoId = req.params.id;
    const { completed, title, description, due_date } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }
    const todo = await todoService.updateTodo(userId, todoId, { completed, title, description, due_date });
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ message: 'Todo not found or not authorized' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update todo', error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const userId = req.body.userId;
    const todoId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }
    const deleted = await todoService.deleteTodo(userId, todoId);
    if (deleted) {
      res.json({ message: 'Todo deleted' });
    } else {
      res.status(404).json({ message: 'Todo not found or not authorized' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete todo', error: err.message });
  }
};


