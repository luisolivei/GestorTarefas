const Task = require('../models/Task');
const User = require('../models/User');
const excelJS = require('exceljs');

// @desc    Exporta todas as tarefas como um ficheiro Excel
// @route   GET /api/reports/export/tasks
// @access  Privado (apenas admin)
const exportTasksReport = async (req, res) => {
	try {
		// Obter todas as tarefas e popular os utilizadores atribuídos (nome e email)
		const tasks = await Task.find().populate('assignedTo', 'name email');

		// Criar workbook e worksheet
		const workbook = new excelJS.Workbook();
		const worksheet = workbook.addWorksheet('Tasks Report');

		// Definir colunas do Excel
		worksheet.columns = [
			{ header: 'Task ID', key: '_id', width: 5 },
			{ header: 'Title', key: 'title', width: 20 },
			{ header: 'Description', key: 'description', width: 30 },
			{ header: 'Priority', key: 'priority', width: 10 },
			{ header: 'Status', key: 'status', width: 10 },
			{ header: 'Due Date', key: 'dueDate', width: 15 },
			{ header: 'Assigned To', key: 'assignedTo', width: 15 },
		];

		// Preencher worksheet com dados das tarefas
		tasks.forEach(task => {
			const assignedTo = task.assignedTo.map(user => `${user.name} (${user.email})`).join(', ');
			worksheet.addRow({
				_id: task._id,
				title: task.title,
				description: task.description,
				priority: task.priority,
				status: task.status,
				dueDate: task.dueDate.toISOString().split('T')[0],
				assignedTo: assignedTo || 'Unassigned', // Se não houver utilizadores atribuídos
			});
		});

		// Definir headers para download do Excel
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename="tasks_report.xlsx"');

		// Escrever workbook na resposta
		return workbook.xlsx.write(res).then(() => {
			res.end();
		});
	} catch (error) {
		res.status(500).json({ message: 'Erro ao exportar relatório de tarefas', error: error.message });
	}
};

// @desc    Exporta relatório de utilizadores e tarefas atribuídas como Excel
// @route   GET /api/reports/export/users
// @access  Privado (apenas admin)
const exportUsersReport = async (req, res) => {
	try {
		// Obter todos os utilizadores
		const users = await User.find().select('name email _id').lean();
		// Obter todas as tarefas
		const userTasks = await Task.find().populate('assignedTo', 'name email _id');

		// Criar mapa de utilizador -> estatísticas de tarefas
		const userTaskMap = {};
		users.forEach(user => {
			userTaskMap[user._id] = {
				name: user.name,
				email: user.email,
				taskCount: 0,
				pendingTasks: 0,
				inProgressTasks: 0,
				completedTasks: 0,
			};
		});

		// Atualizar estatísticas de tarefas para cada utilizador
		userTasks.forEach(task => {
			if (task.assignedTo) {
				task.assignedTo.forEach(assignedUser => {
					if (userTaskMap[assignedUser._id]) {
						userTaskMap[assignedUser._id].taskCount += 1;
						if (task.status === 'Pending') {
							userTaskMap[assignedUser._id].pendingTasks += 1;
						} else if (task.status === 'In Progress') {
							userTaskMap[assignedUser._id].inProgressTasks += 1;
						} else if (task.status === 'Completed') {
							userTaskMap[assignedUser._id].completedTasks += 1;
						}
					}
				});
			}
		});

		// Criar workbook e worksheet para utilizadores
		const workbook = new excelJS.Workbook();
		const worksheet = workbook.addWorksheet('User Task Report');

		// Definir colunas do Excel
		worksheet.columns = [
			{ header: 'Nome do Utilizador', key: 'name', width: 30 },
			{ header: 'Email', key: 'email', width: 40 },
			{ header: 'Total de Tarefas Atribuídas', key: 'taskCount', width: 20 },
			{ header: 'Tarefas Pendentes', key: 'pendingTasks', width: 20 },
			{ header: 'Tarefas em Progresso', key: 'inProgressTasks', width: 20 },
			{ header: 'Tarefas Concluídas', key: 'completedTasks', width: 20 },
		];

		// Adicionar dados de cada utilizador ao worksheet
		Object.values(userTaskMap).forEach(user => {
			worksheet.addRow(user);
		});

		// Definir headers para download
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename="users_report.xlsx"');

		// Escrever workbook na resposta
		return workbook.xlsx.write(res).then(() => {
			res.end();
		});
	} catch (error) {
		res.status(500).json({ message: 'Erro ao exportar relatório de utilizadores', error: error.message });
	}
};

module.exports = {
	exportTasksReport,
	exportUsersReport,
};
