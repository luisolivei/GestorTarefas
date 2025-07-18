// Este arquivo é o ponto de entrada do servidor Express
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); // <-- Importar a função de conexão com o banco de dados


const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação

const app = express();
// Configuração do CORS
app.use(
	cors({
		origin: process.env.CLIENT_URL || '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);
// Coneção com a base de dados
connectDB();

// Middleware
app.use(express.json());

// Rotas
// app.use('/api/auth', authRoutes);
// app.use("/api/tasks", taskRoutes)
// app.use("/api/users", userRoutes)
// app.use("/api/reports", reportRoutes)

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
