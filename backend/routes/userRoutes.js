const express = require('express');
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const { getUsers, getUserById, deleteUser } = require('../controllers/userController');

const router = express.Router();

// ------------------------
// Rotas de Gestão de Utilizadores (Admin apenas)
// ------------------------

// Obter todos os utilizadores com papel 'member'
// Apenas acessível a Admin
router.get('/', protect, adminOnly, getUsers);

// Obter detalhes de um utilizador específico pelo ID
// Apenas acessível a Admin
router.get('/:id', protect, adminOnly, getUserById);

// Eliminar um utilizador pelo ID
// Apenas acessível a Admin
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
