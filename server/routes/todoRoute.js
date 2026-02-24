const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all todos for the authenticated user
router.get('/', todoController.getAllTodos);

// Create todo
router.post('/', todoController.createTodo);

// delete todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
