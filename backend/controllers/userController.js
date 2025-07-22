const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all users(Admin Only)
// @route   GET /api/users
// @access  Private(Admin)
const getUsers = async (req, res) => {
	try {
		const users = await User.find({ role: 'member' }).select('-password'); // Exclude password field

		//Add tasks count to each user
		const usersWithTaskCount = await Promise.all(
			users.map(async user => {
				const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'pending' });
				const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: 'in-progress' });
				const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'completed' });
				return {
					...user._doc, //Include all existing user data
					pendingTasks,
					inProgressTasks,
					completedTasks,
				};
			}),
        );
        res.status(200).json(usersWithTaskCount);
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private(Admin)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password field
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

// @desc Delete user (Admin Only)
// @route DELETE /api/users/:id
// @access Private(Admin)
const deleteUser = async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser) return res.status(404).json({ message: 'User not found' });
		res.json({ message: 'User removed' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = { getUsers, getUserById, deleteUser };
