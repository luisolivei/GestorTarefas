import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const MyTasks = () => {
	// Estado para armazenar todas as tarefas do utilizador
	const [allTasks, setAllTasks] = useState([]);

	// Estado para armazenar as abas de filtragem por status
	const [tabs, setTabs] = useState([]);
	// Estado para armazenar o status atualmente selecionado
	const [filterStatus, setFilterStatus] = useState('All');

	const navigate = useNavigate(); // Hook para navegação entre rotas

	// Função para obter todas as tarefas do utilizador
	const getAllTasks = useCallback(async () => {
		try {
			// Requisição GET para obter tarefas filtradas por status
			const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
				params: { status: filterStatus === 'All' ? '' : filterStatus },
			});

			// Atualiza o estado com as tarefas recebidas
			setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

			// Obter resumo do status das tarefas (para as tabs)
			const statusSummary = response.data?.statusSummary || {};

			// Cria array de abas com label e quantidade
			const statusArray = [
				{ label: 'All', count: statusSummary.all || 0 },
				{ label: 'Pending', count: statusSummary.pendingTasks || 0 },
				{ label: 'In Progress', count: statusSummary.inProgressTasks || 0 },
				{ label: 'Completed', count: statusSummary.completedTasks || 0 },
			];
			setTabs(statusArray); // Atualiza o estado das tabs
		} catch (error) {
			console.error('Erro ao obter tarefas:', error);
		}
	}, [filterStatus]);

	// Função para navegar para a página de detalhes da tarefa
	const handleClick = taskId => {
		navigate(`/user/task-details/${taskId}`);
	};

	// useEffect para chamar getAllTasks sempre que filterStatus mudar
	useEffect(() => {
		getAllTasks();
		return () => {};
	}, [getAllTasks]);

	return (
		<DashboardLayout activeMenu='Minhas Tarefas'>
			<div className='my-5'>
				{/* Cabeçalho e filtro */}
				<div className='flex flex-col lg:flex-row lg:items-center justify-between'>
					<h2 className='text-xl md:text-xl font-medium'>Minhas Tarefas</h2>

					{/* Renderiza as abas apenas se existirem tarefas */}
					{tabs?.[0]?.count > 0 && (
						<TaskStatusTabs
							tabs={tabs} // array de tabs
							activeTab={filterStatus} // status selecionado
							setActiveTab={setFilterStatus} // função para atualizar status
						/>
					)}
				</div>

				{/* Lista de tarefas em grid */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
					{allTasks?.map(item => (
						<TaskCard
							key={item._id}
							title={item.title}
							description={item.description}
							priority={item.priority}
							status={item.status}
							progress={item.progress}
							createdAt={item.createdAt}
							dueDate={item.dueDate}
							assignedTo={item.assignedTo?.map(item => item.profileImageUrl)}
							attachmentCount={item.attachments?.length || 0}
							completedTodoCount={item.completedTodoCount || 0}
							todoChecklist={item.todoChecklist || []}
							onClick={() => handleClick(item._id)} // Navega para detalhes ao clicar
						/>
					))}
				</div>
			</div>
		</DashboardLayout>
	);
};

export default MyTasks;
