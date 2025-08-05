const express = require('express');
const {body, validationResult} = require('express-validator'); 
const { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const sanitizeInputs = require('../middlewares/sanitizeInputs');

const router = express.Router();

// Middleware para verificar erros de validação
function checkValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

// Validação para registo
const validateRegister = [
	body('email').isEmail().withMessage('Email inválido'),
	body('password').isLength({ min: 6 }).withMessage('A password deve ter pelo menos 6 caracteres'),
	body('name').notEmpty().withMessage('O nome é obrigatório'),
];

// Validação para login
const validateLogin = [
	body('email').isEmail().withMessage('Email inválido'),
	body('password').notEmpty().withMessage('Password é obrigatória'),
];

// Rotas de autenticação com validação
router.post('/register', validateRegister, checkValidationErrors, sanitizeInputs, registerUser); // Registar usuário
router.post('/login', validateLogin, checkValidationErrors, sanitizeInputs, loginUser); // Login do usuário
router.get('/profile', protect, getUserProfile); // Buscar perfil do usuário
router.put('/profile', protect, sanitizeInputs, updateUserProfile); // Update do perfil do usuário
router.post('/logout', protect, logoutUser); // Logout do usuario

router.post('/upload-image', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' });
	}
	const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
	res.status(200).json({ imageUrl });
});

// Rota de teste para sanitização
router.post('/teste-sanitize', sanitizeInputs, (req, res) => {
	console.log('Body recebido:', req.body);
	res.json({ recebido: req.body });
});

module.exports = router;
