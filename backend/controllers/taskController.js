const Task = require('../models/Task');

// @desc    Obter todas as tarefas
// Admin: todas as tarefas, User: apenas as atribuídas
// @route   GET /api/tasks
// @access  Privado
const getTasks = async (req, res) => {
	try {
		const { status } = req.query; // Filtro opcional por status
		let filter = {};

		if (status) {
			filter.status = status;
		}

		let tasks;

		if (req.user.role === 'admin') {
			// Admin vê todas as tarefas
			tasks = await Task.find(filter).populate('assignedTo', 'name email profileImageUrl');
		} else {
			// User vê apenas tarefas atribuídas a si
			tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate('assignedTo', 'name email profileImageUrl');
		}

		// Adicionar contagem de tarefas concluídas na checklist
		tasks = await Promise.all(
			tasks.map(async task => {
				const completedCount = task.todoChecklist.filter(item => item.completed).length;
				return { ...task._doc, completedTodoCount: completedCount };
			}),
		);

		// Contagem de tarefas por status
		const allTasks = await Task.countDocuments(req.user.role === 'admin' ? {} : { assignedTo: req.user._id });
		const pendingTasks = await Task.countDocuments({
			...filter,
			status: 'Pending',
			...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id }),
		});
		const inProgressTasks = await Task.countDocuments({
			...filter,
			status: 'In Progress',
			...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id }),
		});
		const completedTasks = await Task.countDocuments({
			...filter,
			status: 'Completed',
			...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
		});

		res.status(200).json({
			tasks,
			statusSummary: {
				all: allTasks,
				pendingTasks,
				inProgressTasks,
				completedTasks,
			},
		});
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// @desc    Obter uma tarefa pelo ID
// @route   GET /api/tasks/:id
// @access  Privado
const getTaskById = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');
		if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
		res.json(task);
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// @desc    Criar nova tarefa (apenas Admin)
// @route   POST /api/tasks
// @access  Privado (Admin)
const createTask = async (req, res) => {
	try {
		const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;

		if (!title || typeof title !== 'string') {
			return res.status(400).json({ message: 'O campo "title" é obrigatório e deve ser uma string.' });
		}

		let assignedUsers;

		if (req.user.role === 'admin') {
			if (!assignedTo || !Array.isArray(assignedTo) || assignedTo.length === 0) {
				return res.status(400).json({ message: 'assignedTo deve ser um array com pelo menos um ID de utilizador.' });
			}
			assignedUsers = assignedTo;
		} else {
			// Utilizador normal → tarefa atribuída a si próprio
			assignedUsers = [req.user._id];
		}

		const task = await Task.create({
			title,
			description,
			priority,
			dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 semana
			assignedTo: assignedUsers,
			createdBy: req.user._id,
			todoChecklist,
			attachments,
		});

		res.status(201).json({ message: 'Tarefa criada', task });
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// @desc    Atualizar detalhes de uma tarefa
// @route   PUT /api/tasks/:id
// @access  Privado (Admin)
const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, priority, dueDate, status, assignedTo, attachments, todoChecklist } = req.body;

		let task = await Task.findById(id);
		if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });

		if (req.user.role !== 'admin' && !task.assignedTo.includes(req.user._id)) {
			return res.status(403).json({ message: 'Não autorizado para atualizar esta tarefa' });
		}

		let assignedUsers;
		if (req.user.role === 'admin') {
			assignedUsers = assignedTo && Array.isArray(assignedTo) && assignedTo.length > 0 ? assignedTo : task.assignedTo;
		} else {
			assignedUsers = [req.user._id];
		}

		task.title = title || task.title;
		task.description = description || task.description;
		task.priority = priority || task.priority;
		task.dueDate = dueDate || task.dueDate;
		task.status = status || task.status;
		task.assignedTo = assignedUsers;
		task.attachments = attachments || task.attachments;
		task.todoChecklist = todoChecklist || task.todoChecklist;

		const updatedTask = await task.save();

		res.status(200).json({ message: 'Tarefa atualizada', task: updatedTask });
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// @desc    Eliminar tarefa (apenas Admin)
// @route   DELETE /api/tasks/:id
// @access  Privado (Admin)
const deleteTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });

		await task.deleteOne();
		res.json({ message: 'Tarefa eliminada com sucesso' });
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// @desc    Atualizar status da tarefa
// @route   PUT /api/tasks/:id/status
// @access  Privado
const updateTaskStatus = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });

		const isAssigned = task.assignedTo.some(user_id => user_id.toString() === req.user._id.toString());
		if (!isAssigned && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Não autorizado' });
		}

		task.status = req.body.status || task.status;

		if (task.status === 'Completed') {
			task.todoChecklist.forEach(item => (item.completed = true));
			task.progress = 100;
		}

		await task.save();
		res.json({ message: 'Status da tarefa atualizado', task });
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// @desc    Atualizar checklist de uma tarefa
// @route   PUT /api/tasks/:id/todo
// @access  Privado
const updateTaskChecklist = async (req, res) => {
	try {
		const { todoChecklist } = req.body;
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });

		if (!task.assignedTo.includes(req.user._id) && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Não autorizado' });
		}

		task.todoChecklist = todoChecklist;

		const completedCount = task.todoChecklist.filter(item => item.completed).length;
		const totalItems = task.todoChecklist.length;
		task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

		if (task.progress === 100) task.status = 'Completed';
		else if (task.progress > 0) task.status = 'In Progress';
		else task.status = 'Pending';

		await task.save();

		const updatedTask = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');
		res.json({ message: 'Checklist da tarefa atualizada', task: updatedTask });
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// @desc    Obter dados do dashboard (Admin)
// @route   GET /api/tasks/dashboard-data
// @access  Privado (Admin)
const getDashboardData = async (req, res) => {
	try {
		const totalTasks = await Task.countDocuments();
		const pendingTasks = await Task.countDocuments({ status: 'Pending' });
		const completedTasks = await Task.countDocuments({ status: 'Completed' });
		const overdueTasks = await Task.countDocuments({ status: { $ne: 'Completed' }, dueDate: { $lt: new Date() } });

		const taskStatuses = ['Pending', 'In Progress', 'Completed'];
		const taskDistributionRaw = await Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
		const taskDistribution = taskStatuses.reduce((acc, status) => {
			acc[status.replace(/\s+/g, '')] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
			return acc;
		}, {});
		taskDistribution['All'] = totalTasks;

		const taskPriorities = ['Low', 'Medium', 'High'];
		const taskPriorityLevelsRaw = await Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
		const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
			acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
			return acc;
		}, {});

		const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(10).select('title status priority dueDate createdAt');

		res.status(200).json({
			stastistics: { totalTasks, pendingTasks, completedTasks, overdueTasks },
			charts: { taskDistribution, taskPriorityLevels },
			recentTasks,
		});
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// @desc    Obter dados do dashboard para um utilizador específico
// @route   GET /api/tasks/user-dashboard-data
// @access  Privado
const getUserDashboardData = async (req, res) => {
	try {
		const userId = req.user._id;

		const totalTasks = await Task.countDocuments({ assignedTo: userId });
		const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' });
		const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });
		const overdueTasks = await Task.countDocuments({ assignedTo: userId, status: { $ne: 'Completed' }, dueDate: { $lt: new Date() } });

		const taskStatuses = ['Pending', 'In Progress', 'Completed'];
		const taskDistributionRaw = await Task.aggregate([{ $match: { assignedTo: userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
		const taskDistribution = taskStatuses.reduce((acc, status) => {
			acc[status.replace(/\s+/g, '')] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
			return acc;
		}, {});
		taskDistribution['All'] = totalTasks;

		const taskPriorities = ['Low', 'Medium', 'High'];
		const taskPriorityLevelsRaw = await Task.aggregate([{ $match: { assignedTo: userId } }, { $group: { _id: '$priority', count: { $sum: 1 } } }]);
		const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
			acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
			return acc;
		}, {});
		// Obter as 10 tarefas mais recentes do utilizador
		const recentTasks = await Task.find({ assignedTo: userId })
			.sort({ createdAt: -1 }) // Ordenar do mais recente para o mais antigo
			.limit(10)
			.select('title status priority dueDate createdAt'); // Selecionar apenas campos necessários

		// Enviar resposta com estatísticas, gráficos e tarefas recentes
		res.status(200).json({
			stastistics: {
				totalTasks, // Total de tarefas atribuídas ao utilizador
				pendingTasks, // Tarefas pendentes
				completedTasks, // Tarefas concluídas
				overdueTasks, // Tarefas com prazo expirado
			},
			charts: {
				taskDistribution, // Distribuição das tarefas por status
				taskPriorityLevels, // Distribuição das tarefas por prioridade
			},
			recentTasks, // Últimas 10 tarefas
		});
	} catch (error) {
		// Em caso de erro no servidor
		res.status(500).json({ message: 'Erro no servidor', error: error.message });
	}
};

// Exportar todas as funções do controller para serem usadas nas rotas
module.exports = {
	getTasks, // Obter todas as tarefas
	getTaskById, // Obter tarefa pelo ID
	createTask, // Criar nova tarefa
	updateTask, // Atualizar tarefa
	deleteTask, // Eliminar tarefa
	updateTaskStatus, // Atualizar status de tarefa
	updateTaskChecklist, // Atualizar checklist de uma tarefa
	getDashboardData, // Obter dados do dashboard (Admin)
	getUserDashboardData, // Obter dados do dashboard do utilizador
};
