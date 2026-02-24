const todoRepository = require('../repositories/todoRepository');

exports.getAllTodos = async (userId) => {
  return todoRepository.getAllTodos(userId);
};

exports.createTodo = async (userId, title) => {
  return todoRepository.createTodo(userId, title);
};

exports.deleteTodo = async (userId, todoId) => {
  return todoRepository.deleteTodo(userId, todoId);
};

exports.updateTodo = async (userId, todoId, completed) => {
  return todoRepository.updateTodo(userId, todoId, completed);
};
