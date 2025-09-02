const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Gerar token JWT para autenticação
const generateToken = userId => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '1h',
	});
};

// @desc Registar novo usuário
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
	try {
		const { name, email, password, profileImageUrl, adminInviteToken } = req.body;
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: 'User already exists' });
		}

		let role = 'member';
		if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
			role = 'admin';
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			profileImageUrl,
			role,
		});

		// Criar token
		const token = generateToken(user._id);

		// Definir cookie HttpOnly
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
		});

		// Retornar apenas dados do utilizador
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			profileImageUrl: user.profileImageUrl,
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
		const token = generateToken(user._id);

		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // Define secure flag em produção
			sameSite: 'Strict', // Define SameSite para evitar CSRF
			maxAge: 3600000, // 1 hora
		});

		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			profileImageUrl: user.profileImageUrl,
			
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
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updateUser = await user.save();
        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            token: generateToken(updateUser._id),
        });
        
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc Logout prefil do usuário
// @route post /api/auth/logout

// Função para efetuar logout do utilizador
const logoutUser = (req, res) => {
	// Define o cookie 'token' como vazio e com expiração imediata
	res.cookie('token', '', {
		httpOnly: true, // Impede que o cookie seja acedido via JavaScript no navegador
		expires: new Date(0), // Faz o cookie expirar imediatamente
		sameSite: 'Strict', // Evita envio do cookie em pedidos cross-site
		secure: process.env.NODE_ENV === 'production', // Apenas em HTTPS em produção
	});
	
	// Envia uma resposta de sucesso para o cliente
	res.status(200).json({ message: 'Logout' });
};

// Exporta todas as funções relacionadas com utilizadores para serem usadas noutros módulos
module.exports = { 
	registerUser,        // Função para registar um novo utilizador
	loginUser,           // Função para autenticar um utilizador
	getUserProfile,      // Função para obter o perfil do utilizador
	updateUserProfile,   // Função para atualizar o perfil do utilizador
	logoutUser           // Função para efetuar logout
};