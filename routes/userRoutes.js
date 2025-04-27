// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rota para criar um novo usuário (POST /usuarios)
router.post('/', userController.createUser);

// Rota para listar todos os usuários (GET /usuarios)
router.get('/', userController.getAllUsers);

// Rota para buscar um usuário por ID (GET /usuarios/:id)
router.get('/:id', userController.getUserById);

// Rota para atualizar um usuário por ID (PUT /usuarios/:id)
router.put('/:id', userController.updateUser);

// Rota para deletar um usuário por ID (DELETE /usuarios/:id)
router.delete('/:id', userController.deleteUser);

module.exports = router; // Exporta o roteador configurado