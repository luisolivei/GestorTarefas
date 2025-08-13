// Este arquivo é o ponto de entrada do servidor Express
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize'); // <-- Importar o middleware de sanitização
const connectDB = require('./config/db'); // <-- Importar a função de conexão com o banco de dados

const helmet = require('helmet'); // <-- Importar o middleware Helmet para segurança


const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação
const userRoutes = require('./routes/userRoutes'); // Rotas de tarefas
const taskRoutes = require('./routes/taskRoutes'); // Rotas de tarefas
const reportRoutes = require('./routes/reportRoutes'); // Rotas de relatórios

const app = express();

// Configuração do CORS
app.use(
	cors({
		origin: process.env.CLIENT_URL || 'http://localhost:5173', // frontend
		credentials: true, // <-- Permitir cookies
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);

// Coneção com a base de dados
connectDB();

// Middleware
app.use(express.json());

app.use(cookieParser());


// Middleware de sanitização para evitar injeção de código No-SQL
app.use((req, res, next) => {
	if (req.body) {
		req.body = mongoSanitize.sanitize(req.body);
	}
	next();
});

// Middleware Helmet para definir cabeçalhos HTTP seguros
app.use(helmet());

// Rotas
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Servir arquivo upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
