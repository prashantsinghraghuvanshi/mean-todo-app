const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');


// Get all todos
router.get('/', todoController.getAllTodos);

// Create todo
router.post('/', todoController.createTodo);

// update todo
router.put('/:id', todoController.updateTodo);

// delete todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
