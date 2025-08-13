import axios from 'axios';
import { BASE_URL } from './apiPaths';
import { clearUserOn401 } from './authHelper';

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

// Request Interceptor
axiosInstance.interceptors.request.use(
	config => {
		return config;
	},
	error => {
		return Promise.reject(error);
	},
);

// Response Interceptor
axiosInstance.interceptors.response.use(
	response => response,
	error => {
		if (error.response) {
			if (error.response.status === 401) {
				// Limpa o contexto em vez de recarregar a página
				clearUserOn401();
			} else if (error.response.status === 500) {
				console.error('Erro no servidor. Por favor, tente novamente mais tarde.');
			}
		} else if (error.code === 'ECONNABORTED') {
			console.error('Tempo limite de requisição atingido.');
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
