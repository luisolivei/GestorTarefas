import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data'; // Opções de prioridade
import axiosInstance from '../../utils/axiosInstance'; // Axios configurado
import { API_PATHS } from '../../utils/apiPaths'; // Endpoints da API
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Para notificações
import moment from 'moment'; // Manipulação de datas
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';

const UserCreateTask = () => {
	const location = useLocation(); // Hook para aceder ao estado da rota
	const { taskId } = location.state || {}; // Obter ID da tarefa caso seja edição
	const navigate = useNavigate(); // Hook para navegação

	// Estado principal da tarefa
	const [taskData, setTaskData] = useState({
		title: '', // título da tarefa
		description: '', // descrição da tarefa
		priority: 'Low', // prioridade
		dueDate: '', // prazo de entrega
		todoChecklist: [], // checklist de sub-tarefas
		attachments: [], // anexos
	});

	const [currentTask, setCurrentTask] = useState(null); // Estado da tarefa atual (quando editando)
	const [error, setError] = useState(''); // Mensagens de erro
	const [loading, setLoading] = useState(false); // Loading para operações async
	const [openDeleteAlert, setOpenDeleteAlert] = useState(false); // Estado do modal de delete

	// Função para atualizar um campo específico do estado taskData
	const handleValueChange = (key, value) => {
		setTaskData(prevData => ({
			...prevData,
			[key]: value,
		}));
	};

	// Função para limpar o formulário
	const clearData = () => {
		setTaskData({
			title: '',
			description: '',
			priority: 'Low',
			dueDate: '',
			todoChecklist: [],
			attachments: [],
		});
	};

	// Função para criar uma nova tarefa
	const createTask = async () => {
		setLoading(true);

		try {
			// Transformar cada item da checklist em objeto { task, completed }
			const todoList = taskData.todoChecklist?.map(item => ({
				task: item,
				completed: false,
			}));

			// Chamada à API para criar tarefa
			await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
				...taskData,
				dueDate: new Date(taskData.dueDate).toISOString(), // Converter para ISO
				todoChecklist: todoList,
			});

			toast.success('Task created successfully!'); // Notificação de sucesso
			clearData(); // Limpar formulário
		} catch (error) {
			console.error('Erro ao criar tarefa:', error);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	// Função para atualizar uma tarefa existente
	const updateTask = async () => {
		setLoading(true);

		try {
			// Comparar a checklist atual com a anterior para manter estado "completed"
			const todoList = taskData.todoChecklist?.map(item => {
				const prevTodoChecklist = currentTask?.todoChecklist || [];
				const matchedTask = prevTodoChecklist.find(task => task.task == item);

				return {
					task: item,
					completed: matchedTask ? matchedTask.completed : false,
				};
			});

			// Chamada à API para atualizar a tarefa
			await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
				...taskData,
				dueDate: new Date(taskData.dueDate).toISOString(),
				todoChecklist: todoList,
			});

			toast.success('Task updated successfully!');
		} catch (error) {
			console.error('Erro ao atualizar tarefa:', error);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	// Função para submeter o formulário (criação ou atualização)
	const handleSubmit = async () => {
		setError(null);

		// Validação dos campos obrigatórios
		if (!taskData.title.trim()) {
			setError('Título da tarefa é obrigatório.');
			return;
		}
		if (!taskData.description.trim()) {
			setError('Descrição da tarefa é obrigatória.');
			return;
		}
		if (!taskData.dueDate) {
			setError('Prazo de entrega é obrigatório.');
			return;
		}
		if (taskData.todoChecklist?.length === 0) {
			setError('A tarefa deve ter pelo menos um item na checklist.');
			return;
		}

		// Se existir taskId, atualizar; senão, criar
		if (taskId) {
			updateTask();
			return;
		}
		createTask();
	};

	// Função para obter detalhes da tarefa por ID
	const getTaskDetailsByID = useCallback(async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

			if (response.data) {
				const taskInfo = response.data;
				setCurrentTask(taskInfo); // Guarda dados originais da tarefa
				setTaskData({
					title: taskInfo.title || '',
					description: taskInfo.description || '',
					priority: taskInfo.priority || 'Low',
					dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : '',
					todoChecklist: taskInfo?.todoChecklist?.map(item => item?.task) || [],
					attachments: taskInfo?.attachments || [],
				});
			}
		} catch (error) {
			console.error('Erro ao obter detalhes da tarefa:', error);
		}
	}, [taskId]);

	// Função para apagar uma tarefa
	const deleteTask = async () => {
		try {
			await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

			setOpenDeleteAlert(false);
			toast.success('Task deleted successfully!');
			navigate('/user/tasks'); // Redireciona após apagar
		} catch (error) {
			console.error('Erro ao apagar tarefa:', error.response?.data?.message || error.message);
		}
	};

	// useEffect para buscar dados da tarefa se estivermos em edição
	useEffect(() => {
		if (taskId) {
			getTaskDetailsByID(taskId);
		}
		return () => {};
	}, [taskId, getTaskDetailsByID]);

	return (
		<DashboardLayout activeMenu='Create Tasks'>
			<div className='mt-5'>
				<div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
					{/* Formulário da tarefa */}
					<div className='form-card col-span-3'>
						<div className='flex items-center justify-between'>
							<h2 className='text-xl md:text-xl font-medium'>{taskId ? 'Update Task' : 'Create Task'}</h2>

							{/* Botão para apagar tarefa (apenas se estivermos em edição) */}
							{taskId && (
								<button
									className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:bg-rose-300 cursor-pointer:'
									onClick={() => setOpenDeleteAlert(true)}
								>
									<LuTrash2 className='text-base' /> Apagar
								</button>
							)}
						</div>

						{/* Campos do formulário */}
						<div className='mt-4'>
							<label className='text-sx font-medium text-slate-600'>Título </label>
							<input placeholder='Create App UI' className='form-input' value={taskData.title || ''} onChange={({ target }) => handleValueChange('title', target.value)} />
						</div>

						<div className='mt-3'>
							<label className='text-xs font-medium text-slate-600'>Descrição</label>
							<textarea placeholder='Describe Task' className='form-input' rows={4} value={taskData.description || ''} onChange={({ target }) => handleValueChange('description', target.value)} />
						</div>

						<div className='grid grid-cols-12 gap-4 mt-2'>
							{/* Dropdown de prioridade */}
							<div className='col-span-6 md:col-span-4'>
								<label className='text-xs font-medium text-slate-600'>Prioridade</label>
								<SelectDropdown options={PRIORITY_DATA} value={taskData.priority} onChange={value => handleValueChange('priority', value)} placeholder='Select Priority' />
							</div>

							{/* Input de data de entrega */}
							<div className='col-span-6 md:col-span-4'>
								<label className='text-xs font-medium text-slate-600'>Prazo de Entrega</label>
								<input placeholder='Create App UI' className='form-input' value={taskData.dueDate || ''} onChange={({ target }) => handleValueChange('dueDate', target.value)} type='date' />
							</div>
						</div>

						{/* Checklist de subtarefas */}
						<div className='mt-3'>
							<label className='text-xs font-medium text-slate-600'>Checklist das Tarefas</label>
							<TodoListInput todoList={taskData?.todoChecklist} setTodoList={value => handleValueChange('todoChecklist', value)} />
						</div>

						{/* Upload de anexos */}
						<div className='mt-3'>
							<label className='text-xs font-medium text-slate-600'>Inserir Anexos</label>
							<AddAttachmentsInput attachments={taskData?.attachments} setAttachments={value => handleValueChange('attachments', value)} />
						</div>

						{/* Mensagem de erro */}
						{error && <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>}

						{/* Botão de submissão */}
						<div className='flex justify-end mt-7'>
							<button className='add-btn' onClick={handleSubmit} disabled={loading}>
								{taskId ? 'UPDATE' : 'CREATE TASK'}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Modal de confirmação de delete */}
			<Modal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)} title='Delete Task'>
				<DeleteAlert content='Are you sure you want to delete this task?' onDelete={() => deleteTask()} />
			</Modal>
		</DashboardLayout>
	);
};

export default UserCreateTask;
