import { LuLayoutDashboard, LuUsers, LuClipboardCheck, LuSquarePlus, LuLogOut } from 'react-icons/lu';

// Dados do menu lateral para administradores
export const SIDE_MENU_DATA = [
	{
		id: '01',
		label: 'Painel', // Nome do menu
		icon: LuLayoutDashboard, // Ícone associado
		path: '/admin/dashboard', // Caminho da rota
	},
	{
		id: '02',
		label: 'Gerir Tarefas',
		icon: LuClipboardCheck,
		path: '/admin/tasks',
	},
	{
		id: '03',
		label: 'Criar Tarefa',
		icon: LuSquarePlus,
		path: '/admin/create-task',
	},
	{
		id: '04',
		label: 'Membros da equipa',
		icon: LuUsers,
		path: '/admin/users',
	},
	{
		id: '05',
		label: 'Sair',
		icon: LuLogOut,
		path: 'logout', // Rota de logout
	},
];

// Dados do menu lateral para utilizadores
export const SIDE_MENU_USER_DATA = [
	{
		id: '01',
		label: 'Painel',
		icon: LuLayoutDashboard,
		path: '/user/dashboard',
	},
	{
		id: '03',
		label: 'Criar Tarefa',
		icon: LuSquarePlus,
		path: '/user/create-task',
	},
	{
		id: '02',
		label: 'Minhas Tarefas', // Lista de tarefas atribuídas ao utilizador
		icon: LuClipboardCheck,
		path: '/user/tasks',
	},
	{
		id: '05',
		label: 'Sair',
		icon: LuLogOut,
		path: 'logout',
	},
];

// Dados de prioridade das tarefas
export const PRIORITY_DATA = [
	{
		label: 'Baixa', // Baixa prioridade
		value: 'Baixa',
	},
	{
		label: 'Media', // Prioridade média
		value: 'Media',
	},
	{
		label: 'Alta', // Alta prioridade
		value: 'Alta',
	},
];

// Dados de status das tarefas
export const STATUS_DATA = [
	{
		label: 'Pendente', // Pendente
		value: 'Pendente',
	},
	{
		label: 'Em Progresso', // Em progresso
		value: 'Em Progresso',
	},
	{
		label: 'Concluída', // Concluída
		value: 'Concluída',
	},
];
