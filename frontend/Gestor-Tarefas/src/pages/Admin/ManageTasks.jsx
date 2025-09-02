import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const ManageTasks = () => {
	const [allTasks, setAllTasks] = useState([]);

	const [tabs, setTabs] = useState([]);
	const [filterStatus, setFilterStatus] = useState('Total');

	const navigate = useNavigate();

	// Buscar todas as tarefas filtradas por estado
	const getAllTasks = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
				params: { status: filterStatus === 'Total' ? '' : filterStatus },
			});

			setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

			// Mapear os dados do resumo de estados com etiquetas e ordem
			const statusSummary = response.data?.statusSummary || {};

			const statusArray = [
				{ label: 'Total', count: statusSummary.all || 0 },
				{ label: 'Pendente', count: statusSummary.pendingTasks || 0 },
				{ label: 'Em Progresso', count: statusSummary.inProgressTasks || 0 },
				{ label: 'Concluída', count: statusSummary.completedTasks || 0 },
			];
			setTabs(statusArray);
		} catch (error) {
			console.error('Erro ao buscar tarefas:', error);
		}
	};

	// Abrir a página de edição da tarefa
	const handleClick = taskData => {
		navigate('/admin/create-task', { state: { taskId: taskData._id } });
	};

	// Descarregar relatório de tarefas
	const handleDownloadReport = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
				responseType: 'blob', // Importante para ficheiro binário
			});

			// Criar URL para o ficheiro
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'task_report.xlsx'); // ou outra extensão
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Erro ao descarregar o relatório:', error);
			toast.error('Falha ao descarregar o relatório. Tente novamente.');
		}
	};

	useEffect(() => {
		getAllTasks();
		return () => {};
	}, [filterStatus]);

	return (
		<DashboardLayout activeMenu='Gerir Tarefas'>
			<div className='my-5'>
				<div className='flex flex-col lg:flex-row lg:items-center justify-between'>
					<div className='flex items-center justify-between gap-3'>
						<h2 className='text-xl md:text-xl font-medium'>Tarefas</h2>

						{/* Botão de download do relatório visível em dispositivos móveis */}
						<button className='flex lg:hidden download-btn' onClick={handleDownloadReport}>
							<LuFileSpreadsheet className='text-lg' />
							Download Relatório
						</button>
					</div>

					{/* Separadores de estado das tarefas */}
					{tabs?.[0]?.count > 0 && (
						<div className='flex items-center gap-3'>
							<TaskStatusTabs tabs={tabs} activeTab={filterStatus} setActiveTab={setFilterStatus} />
							{/* Botão de download do relatório visível em desktop */}
							<button className='hidden lg:flex download-btn' onClick={handleDownloadReport}>
								<LuFileSpreadsheet className='text-lg' />
								Download Relatório
							</button>
						</div>
					)}
				</div>

				{/* Lista de cartões de tarefas */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
					{allTasks?.map((item) => (
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
							onClick={() => {
								handleClick(item);
							}}
						/>
					))}
				</div>
			</div>
		</DashboardLayout>
	);
};

export default ManageTasks;
