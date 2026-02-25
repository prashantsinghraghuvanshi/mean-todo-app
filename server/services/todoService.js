const todoRepository = require('../repositories/todoRepository');

exports.getAllTodos = async (userId) => {
  return todoRepository.getAllTodos(userId);
};

exports.createTodo = async (userId, title, description, due_date) => {
  return todoRepository.createTodo(userId, title, description, due_date);
};

exports.deleteTodo = async (userId, todoId) => {
  return todoRepository.deleteTodo(userId, todoId);
};

exports.updateTodo = async (userId, todoId, updates) => {
  return todoRepository.updateTodo(userId, todoId, updates);
};
