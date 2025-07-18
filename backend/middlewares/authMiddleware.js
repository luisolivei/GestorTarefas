const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas
const protect = async (req, res, next) => {
	try {
		let token = req.headers.authorization;

		if (token && token.startsWith('Bearer ')) {
			token = token.split(' ')[1]; //Extrair o token do header
			const decoded = jwt.verify(token, process.env.JWT_SECRET); //Verifica o token
			req.user = await User.findById(decoded.id).select('-password'); // Procura o usuario e exclui a senha
			next(); // Vai para o próximo middleware ou rota
		} else {
			res.status(401).json({ message: 'Not authorized, no token' }); //Se o token nao for fornecido, retorna um erro
		}
	} catch (error) {
		res.status(401).json({ message: 'Not authorized, token failed' }); //Se a verificação do token falhar, retorna um erro.
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
