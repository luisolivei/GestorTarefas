const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas de autenticação
router.post("/register", registerUser); // Registar usuário
router.post("/login", loginUser); // Login do usuário
router.get("/profile", protect, getUserProfile); // Buscar perfil do usuário
router.put("/profile", protect, updateUserProfile); // Update do perfil do usuário

module.exports = router;