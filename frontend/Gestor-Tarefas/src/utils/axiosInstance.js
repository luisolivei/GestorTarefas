import axios from 'axios';
import { BASE_URL } from './apiPaths';
import { clearUserOn401 } from './authHelper';

// Cria uma instância do Axios com configurações padrão
const axiosInstance = axios.create({
	baseURL: BASE_URL, // URL base para todas as requisições
	timeout: 10000, // Tempo limite de 10s para as requisições
	withCredentials: true, // Envia cookies HttpOnly com cada pedido
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

// Interceptor de requisição
// Permite modificar a request antes de ser enviada
axiosInstance.interceptors.request.use(
	config => {
		// Aqui poderias adicionar headers de autenticação se necessário
		return config;
	},
	error => {
		// Rejeita a promise em caso de erro na requisição
		return Promise.reject(error);
	},
);

// Interceptor de resposta
// Permite lidar com respostas ou erros globalmente
axiosInstance.interceptors.response.use(
	response => response, // Retorna a resposta se estiver OK
	error => {
		if (error.response) {
			// Se houver resposta do servidor
			if (error.response.status === 401) {
				// Se não estiver autorizado, limpa o utilizador do contexto
				clearUserOn401();
			} else if (error.response.status === 500) {
				// Erro interno do servidor
				console.error('Erro no servidor. Por favor, tente novamente mais tarde.');
			}
		} else if (error.code === 'ECONNABORTED') {
			// Requisição ultrapassou o tempo limite
			console.error('Tempo limite de requisição atingido.');
		}
		return Promise.reject(error); // Rejeita a promise com o erro
	},
);

export default axiosInstance;
