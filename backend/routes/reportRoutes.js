const express = require('express');
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const { exportTasksReport, exportUsersReport } = require('../controllers/reportController');

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport); // Exportar relatório de tarefas
router.get("/export/users", protect, adminOnly, exportUsersReport); // Exportar relatório de usuários

module.exports = router;

