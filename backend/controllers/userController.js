const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Obter todos os utilizadores (Apenas Admin)
// @route   GET /api/users
// @access  Private(Admin)
const getUsers = async (req, res) => {
	try {
		// Buscar todos os utilizadores com role 'member', excluindo a password
		const users = await User.find({ role: 'member' }).select('-password');

		// Adicionar contagem de tarefas a cada utilizador
		const usersWithTaskCount = await Promise.all(
			users.map(async user => {
				const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Pendente' });
				const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Em Progresso' });
				const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Concluída' });

				// Retornar objeto do utilizador com contagem de tarefas incluída
				return {
					...user._doc, // Inclui todos os dados existentes do utilizador
					pendingTasks,
					inProgressTasks,
					completedTasks,
				};
			}),
		);

		// Enviar resposta com a lista de utilizadores e respetiva contagem de tarefas
		res.status(200).json(usersWithTaskCount);
	} catch (error) {
		// Em caso de erro no servidor
		res.status(500).json({ message: 'Erro no servidor' });
	}
};

// @desc    Obter utilizador pelo ID
// @route   GET /api/users/:id
// @access  Private(Admin)
const getUserById = async (req, res) => {
	try {
		// Buscar utilizador pelo ID, excluindo password
		const user = await User.findById(req.params.id).select('-password');
		if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });

		// Enviar dados do utilizador
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: 'Erro no servidor' });
	}
};

// @desc    Eliminar utilizador (Apenas Admin)
// @route   DELETE /api/users/:id
// @access  Private(Admin)
const deleteUser = async (req, res) => {
	try {
		// Eliminar utilizador pelo ID
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser) return res.status(404).json({ message: 'Utilizador não encontrado' });

		// Confirmar remoção
		res.json({ message: 'Utilizador eliminado com sucesso' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erro no servidor' });
	}
};

// Exportar funções para uso nas rotas
module.exports = { getUsers, getUserById, deleteUser };
