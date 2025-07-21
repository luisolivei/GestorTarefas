const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas
const protect = async (req, res, next) => {
	try {
		const token = req.cookies.token; // ler token do cookie

		if (!token) {
			return res.status(401).json({ message: 'Not authorized, no token' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id).select('-password');
		next();
	} catch (error) {
		res.status(401).json({ message: 'Not authorized, token failed' });
	}
};

//Middleware para verificar se o usuário é admin
const adminOnly = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next(); //Se o usuário for admin prossegue para o próximo middleware ou rota
	} else {
		res.status(403).json({ message: 'Acess denied, admin only' }); //Se o usuário não for admin, retorna um erro
	}
};

module.exports = { protect, adminOnly };
