import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth'; // Hook para obter o utilizador autenticado

const CreateTask = () => {
	const location = useLocation();
	const { taskId } = location.state || {}; // obtém o taskId se existir (para edição)
	const navigate = useNavigate();
	const { user } = useUserAuth(); // obtém o utilizador autenticado

	const [taskData, setTaskData] = useState({
		title: '', // título da task
		description: '', // descrição da task
		priority: 'Baixa', // prioridade inicial
		dueDate: '', // data de entrega
		assignedTo: [], // utilizadores atribuídos
		todoChecklist: [], // checklist de subtarefas
		attachments: [], // anexos
	});

	const [currentTask, setCurrentTask] = useState(null); // dados da task atual (para edição)
	const [error, setError] = useState(''); // mensagem de erro do formulário
	const [loading, setLoading] = useState(false); // estado de loading
	const [openDeleteAlert, setOpenDeleteAlert] = useState(false); // modal de confirmação de eliminação

	// Função para atualizar os valores do formulário
	const handleValueChange = (key, value) => {
		setTaskData(prevData => ({
			...prevData,
			[key]: value,
		}));
	};

	// Limpa os dados do formulário
	const clearData = () => {
		setTaskData({
			title: '',
			description: '',
			priority: 'Baixa',
			dueDate: null,
			assignedTo: [],
			todoChecklist: [],
			attachments: [],
		});
	};

	// Criar uma nova task
	const createTask = async () => {
		setLoading(true);
		try {
			const todoList = taskData.todoChecklist?.map(item => ({
				task: item,
				completed: false,
			}));

			await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
				...taskData,
				dueDate: new Date(taskData.dueDate).toISOString(),
				todoChecklist: todoList,
			});

			toast.success('Task criada com sucesso!');
			clearData(); // limpa o formulário após criar a task
		} catch (error) {
			console.error('Erro ao criar task:', error);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	// Atualizar uma task existente
	const updateTask = async () => {
		setLoading(true);
		try {
			const todoList = taskData.todoChecklist?.map(item => {
				const prevTodoChecklist = currentTask?.todoChecklist || [];
				const matchedTask = prevTodoChecklist.find(task => task.task == item);
				return {
					task: item,
					completed: matchedTask ? matchedTask.completed : false, // mantém estado das subtarefas existentes
				};
			});

			await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
				...taskData,
				dueDate: new Date(taskData.dueDate).toISOString(),
				todoChecklist: todoList,
			});

			toast.success('Task atualizada com sucesso!');
		} catch (error) {
			console.error('Erro ao atualizar task:', error);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	// Submeter formulário: valida e cria ou atualiza task
	const handleSubmit = async () => {
		setError(null);

		// validações do formulário
		if (!taskData.title.trim()) {
			setError('O título da task é obrigatório.');
			return;
		}
		if (!taskData.description.trim()) {
			setError('A descrição da task é obrigatória.');
			return;
		}
		if (!taskData.dueDate) {
			setError('A data de entrega é obrigatória.');
			return;
		}

		// apenas admins devem atribuir a utilizadores
		if (user?.role === 'admin' && taskData.assignedTo?.length === 0) {
			setError('A task não foi atribuída a nenhum membro.');
			return;
		}

		// valida checklist
		if (taskData.todoChecklist?.length === 0) {
			setError('A task deve ter pelo menos um item TODO.');
			return;
		}

		if (taskId) {
			updateTask(); // se existir taskId, atualiza
			return;
		}

		createTask(); // caso contrário, cria nova task
	};

	// Obter detalhes da task pelo ID
	const getTaskDetailsByID = useCallback(async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
			if (response.data) {
				const taskInfo = response.data;
				setCurrentTask(taskInfo);
				setTaskData({
					title: taskInfo.title,
					description: taskInfo.description,
					priority: taskInfo.priority,
					dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : null,
					assignedTo: taskInfo?.assignedTo?.map(item => item._id) || [],
					todoChecklist: taskInfo?.todoChecklist?.map(item => item?.task) || [],
					attachments: taskInfo?.attachments || [],
				});
			}
		} catch (error) {
			console.error('Erro ao obter detalhes da task:', error);
		}
	}, [taskId]);

	// Eliminar task
	const deleteTask = useCallback(async () => {
		try {
			await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
			setOpenDeleteAlert(false); // fecha modal de confirmação
			toast.success('Tarefa eliminada com sucesso!');
			navigate('/admin/tasks'); // redireciona para lista de tasks
		} catch (error) {
			console.error('Erro ao eliminar tarefa:', error.response?.data?.message || error.message);
		}
	}, [taskId, navigate]);

	useEffect(() => {
		if (taskId) {
			getTaskDetailsByID(); // se houver taskId, carrega dados da task para edição
		}
	}, [taskId, getTaskDetailsByID]);

	return (
		<DashboardLayout activeMenu='Criar Tarefa'>
			<div className='mt-5'>
				<div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
					<div className='form-card col-span-3'>
						<div className='flex items-center justify-between'>
							<h2 className='text-xl md:text-xl font-medium'>{taskId ? 'Atualizar Task' : 'Criar Tarefa'}</h2>
							{taskId && (
								<button
									className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:bg-rose-300 cursor-pointer:'
									onClick={() => setOpenDeleteAlert(true)} // abre modal de confirmação de eliminação
								>
									<LuTrash2 className='text-base' /> Apagar
								</button>
							)}
						</div>

						<div className='mt-4'>
							<label className='text-sx font-medium text-slate-600'>Título</label>
							<input placeholder='Inserir Título' className='form-input' value={taskData.title} onChange={({ target }) => handleValueChange('title', target.value)} />
						</div>

						<div className='mt-3'>
							<label className='text-xs font-medium text-slate-600'>Descrição</label>
							<textarea placeholder='Descreve a Tarefa' className='form-input' rows={4} value={taskData.description} onChange={({ target }) => handleValueChange('description', target.value)} />
						</div>

						<div className='grid grid-cols-12 gap-4 mt-2'>
							<div className='col-span-6 md:col-span-4'>
								<label className='text-xs font-medium text-slate-600'>Prioridade</label>
								<SelectDropdown options={PRIORITY_DATA} value={taskData.priority} onChange={value => handleValueChange('priority', value)} placeholder='Selecionar Prioridade' />
							</div>

							<div className='col-span-6 md:col-span-4'>
								<label className='text-xs font-medium text-slate-600'>Prazo de Entrega</label>
								<input className='form-input' value={taskData.dueDate} onChange={({ target }) => handleValueChange('dueDate', target.value)} type='date' />
							</div>

							{/* Renderizar "Atribuido a" apenas para admins */}
							{user?.role === 'admin' && (
								<div className='col-span-12 md:col-span-3'>
									<label className='text-xs font-medium text-slate-600'>Atribuído a</label>
									<SelectUsers selectedUsers={taskData.assignedTo} setSelectedUsers={value => handleValueChange('assignedTo', value)} />
								</div>
							)}
						</div>

						<div className='mt-3'>
							<label className='text-xs font-medium text-slate-600'>Checklist de Tarefas</label>
							<TodoListInput todoList={taskData?.todoChecklist} setTodoList={value => handleValueChange('todoChecklist', value)} />
						</div>

						<div className='mt-3'>
							<label className='text-xs font-medium text-slate-600'>Inserir Anexos</label>
							<AddAttachmentsInput attachments={taskData?.attachments} setAttachments={value => handleValueChange('attachments', value)} />
						</div>

						{/* Mensagem de erro */}
						{error && <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>}

						<div className='flex justify-end mt-7'>
							<button className='add-btn' onClick={handleSubmit} disabled={loading}>
								{taskId ? 'ATUALIZAR' : 'CRIAR TAREFA'}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Modal para confirmar eliminação da task */}
			<Modal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)} title='Eliminar Tarefa'>
				<DeleteAlert content='Tem a certeza que pretende eliminar esta tarefa?' onDelete={() => deleteTask()} />
			</Modal>
		</DashboardLayout>
	);
};

export default CreateTask;
