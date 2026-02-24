const todoRepository = require('../repositories/todoRepository');

exports.getAllTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const todos = await todoRepository.getAllTodos(userId);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch todos', error: err.message });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const todo = await todoRepository.createTodo(userId, title);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create todo', error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;
    const deleted = await todoRepository.deleteTodo(userId, todoId);
    if (deleted) {
      res.json({ message: 'Todo deleted' });
    } else {
      res.status(404).json({ message: 'Todo not found or not authorized' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete todo', error: err.message });
  }
};
