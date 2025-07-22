const Task = require('../models/Task');

// @desc    Get all tasks (Admin: all, User: only assigned tasks)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
	try {
		const { status } = req.query; // Optional status filter
		let filter = {};

		if (status) {
			filter.status = status;
		}

		let tasks;

		if (req.user.role === 'admin') {
			tasks = await Task.find(filter).populate('assignedTo', 'name email profileImageUrl');
		} else {
			tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate('assignedTo', 'name email profileImageUrl');
		}

		// Add completed todoChecklist count to each task
		tasks = await Promise.all(
			tasks.map(async task => {
				const completedCount = task.todoChecklist.filter(item => item.completed).length;
				return { ...task._doc, completedTodoCount: completedCount };
			})
        );
        
        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === 'admin' ? {} : { assignedTo: req.user._id }
        );
        const pendingTasks = await Task.countDocuments({
            ...filter, status: 'Pending', ...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id }) 
        });
        const inProgressTasks = await Task.countDocuments({
            ...filter, status: 'In Progress', ...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id }) 
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
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Create a new task (Admin only)
// @route   POST /api/tasks
// @access  Private(Admin)
const createTask = async (req, res) => {
	try {
		const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;

		// Validações básicas
		if (!title || typeof title !== 'string') {
			return res.status(400).json({ message: 'O campo "title" é obrigatório e deve ser uma string.' });
		}

		if (!assignedTo || !Array.isArray(assignedTo) || assignedTo.length === 0) {
			return res.status(400).json({ message: 'assignedTo deve ser um array com pelo menos um ID de utilizador.' });
		}

		const task = await Task.create({
			title,
			description,
			priority,
			dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to one week from now
			assignedTo,
			createdBy: req.user._id, // Assuming req.user is populated with the authenticated user
			todoChecklist,
			attachments,
		});

		res.status(201).json({ message: 'Task created', task });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private(Admin)
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: 'assignedTo must be an array of user IDs.' });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updateTask = await task.save();
        res.json({ message: 'Task updated successfully', updateTask });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Delete a task (Admin only)
// @route   DELETE /api/tasks/:id
// @access  Private(Admin)
const deleteTask = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskChecklist = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Get dashboard data (Admin)
// @route   GET /api/tasks/dashboard-data
// @access  Private(Admin)
const getDashboardData = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Get user-specific dashboard data
// @route   GET /api/tasks/user-dashboard-data
// @access  Private
const getUserDashboardData = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

module.exports = {
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
	updateTaskStatus,
	updateTaskChecklist,
	getDashboardData,
	getUserDashboardData,
};
