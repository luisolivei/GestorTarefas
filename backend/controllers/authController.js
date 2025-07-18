const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Gerar token JWT para autenticação
const generateToken = userId => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
};

// @desc Registar novo usuário
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
	try {
		const { name, email, password, profileImageUrl, adminInviteToken } = req.body;
		// Ver se já existe o usuário com o email fornecido
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: 'User already exists' });
		}
		//Determinar o papel do usuário com base no token de convite do admin
		let role = 'member'; // Padrão principal é membro
		if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
			role = 'admin'; // Se o token de convite do admin for fornecido e for valido, o papel do usuário será admin
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Criar novo usuário
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			profileImageUrl,
			role,
		});

		// Retornar dados do usuario com o token
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			profileImageUrl: user.profileImageUrl,
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc Login do usuário
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			profileImageUrl: user.profileImageUrl,
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc Buscar perfil do usuário
// @route GET /api/auth/profile
// @access Private(Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc Update prefil do usuário
// @route PUT /api/auth/profile
// @access Private(Requires JWT)
const updateUserProfile = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
