export const BASE_URL = 'http://localhost:8000';

//utils/apiPaths.js
export const API_PATHS = {
	AUTH: {
		REGISTER: '/api/auth/register', // Registar novo usuário (Admin ou Membro)
		LOGIN: '/api/auth/login', // Autenticar utilizador e retornar JWT token
		GET_PROFILE: '/api/auth/profile', // Buscar detalhes do perfil do usuário autenticado
	},

	USERS: {
		GET_ALL_USERS: '/api/users', // Buscar todos os utilizadores
		GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Buscar utilizador por ID
		CREATE_USER: '/api/users', // Criar novo utilizador (Admin only)
		UPDATE_USER: (userId) => `/api/users/${userId}`, // Atualizar utilizador por ID
		DELETE_USER: (userId) => `/api/users/${userId}`, // Eliminar utilizador por ID
	},

	TASKS: {
		GET_DASHBOARD_DATA: '/api/tasks/dashboard-data', // Buscar dados do dashboard do utilizador
		GET_USER_DASHBOARD_DATA: '/api/tasks/user-dashboard-data', // Buscar dados do dashboard do utilizador
		GET_ALL_TASKS: '/api/tasks', // Buscar todas as tarefas
		GET_TASK_BY_ID: taskId => `/api/tasks/${taskId}`, // Buscar tarefa por ID
		CREATE_TASK: '/api/tasks', // Criar nova tarefa (Admin only)
		UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Atualizar tarefa por ID
		DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Eliminar tarefa por ID

		UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Atualizar status da tarefa
		UPDATE_TASK_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Atualizar checklist da tarefa
	},

	REPORTS: {
		EXPORT_TASKS: '/api/reports/export/tasks', // Exportar todas as tarefas para Excel
		EXPORT_USERS: '/api/reports/export/users', // Exportar todos os utilizadores para Excel
	},

	IMAGE: {
		UPLOAD_IMAGE: '/api/auth/upload-image', // Upload de imagem
	},
};
