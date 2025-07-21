// Este arquivo é o ponto de entrada do servidor Express
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize'); // <-- Importar o middleware de sanitização
const connectDB = require('./config/db'); // <-- Importar a função de conexão com o banco de dados
const xss = require('xss-clean'); // <-- Importar o middleware de limpeza XSS
const helmet = require('helmet'); // <-- Importar o middleware Helmet para segurança


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

// Middleware XSS ajustado para não causar erro
function xssCleanBodyParams(req, res, next) {
  try {
    if (req.body) req.body = xss(req.body);
    if (req.params) req.params = xss(req.params);
    next();
  } catch (err) {
    next(err);
  }
}

app.use(xssCleanBodyParams);

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
// app.use("/api/tasks", taskRoutes)
// app.use("/api/users", userRoutes)
// app.use("/api/reports", reportRoutes)

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
