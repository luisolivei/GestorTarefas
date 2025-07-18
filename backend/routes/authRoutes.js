const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Rotas de autenticação
router.post('/register', registerUser); // Registar usuário
router.post('/login', loginUser); // Login do usuário
router.get('/profile', protect, getUserProfile); // Buscar perfil do usuário
router.put('/profile', protect, updateUserProfile); // Update do perfil do usuário

router.post('/upload-image', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' });
	}
	const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
	res.status(200).json({ imageUrl });
});

module.exports = router;
