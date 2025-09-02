const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getDashboardData, getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require('../controllers/taskController');

const router = express.Router();

// ------------------------
// Rotas de Gestão de Tarefas
// ------------------------

// Obter dados do dashboard para Admin
router.get('/dashboard-data', protect, getDashboardData);

// Obter dados do dashboard específicos do utilizador
router.get('/user-dashboard-data', protect, getUserDashboardData);

// Obter todas as tarefas
// Admin: todas as tarefas
// User: apenas tarefas atribuídas
router.get('/', protect, getTasks);

// Obter detalhes de uma tarefa específica pelo ID
router.get('/:id', protect, getTaskById);

// Criar uma nova tarefa (Apenas Admin)
router.post('/', protect, createTask);

// Atualizar detalhes de uma tarefa existente
router.put('/:id', protect, updateTask);

// Eliminar uma tarefa (Apenas Admin)
router.delete('/:id', protect, adminOnly, deleteTask);

// Atualizar o estado de uma tarefa
router.put('/:id/status', protect, updateTaskStatus);

// Atualizar a checklist de uma tarefa
router.put('/:id/todo', protect, updateTaskChecklist);

module.exports = router;
