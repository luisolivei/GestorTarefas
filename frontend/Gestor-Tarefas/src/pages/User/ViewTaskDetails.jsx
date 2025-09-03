import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment/min/moment-with-locales';
import AvatarGroup from '../../components/AvatarGroup';
import toast from 'react-hot-toast';

moment.locale('pt'); // Define locale global para moment

const ViewTaskDetails = () => {
	const { id } = useParams(); // ID da tarefa na rota
	const [task, setTask] = useState(null); // Estado principal da task
	const [loading, setLoading] = useState(false); // Loading global
	const [newTodo, setNewTodo] = useState(''); // Novo item do checklist
	const [newAttachment, setNewAttachment] = useState(''); // Novo anexo

	// Função para determinar a cor do status
	const getStatusTagColor = status => {
		switch (status) {
			case 'Em Progresso':
				return 'bg-cyan-50 text-cyan-500 border border-cyan-500/10';
			case 'Concluída':
				return 'bg-lime-50 text-lime-500 border border-lime-500/20';
			default:
				return 'bg-violet-50 text-violet-500 border border-violet-500/10';
		}
	};

	// Buscar detalhes da task
	const getTaskDetailsByID = useCallback(async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
			if (response.data) setTask(response.data);
		} catch (error) {
			console.error('Erro ao buscar detalhes da tarefa:', error);
		}
	}, [id]);

	// Atualizar task no backend
	const updateTask = async () => {
		setLoading(true);
		try {
			const todoList = task?.todoChecklist?.map(item => ({
				task: item.task,
				completed: item.completed || false,
			}));

			await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(id), {
				...task,
				dueDate: new Date(task.dueDate).toISOString(),
				todoChecklist: todoList,
			});

			toast.success('Task atualizada com sucesso!'); // <-- toast de sucesso
		} catch (error) {
			console.error('Erro ao atualizar task:', error);
			toast.error('Erro ao atualizar a tarefa.'); // <-- toast de erro
		} finally {
			setLoading(false);
		}
	};

	// Alterar valor genérico
	const handleValueChange = (key, value) => {
		setTask(prev => ({ ...prev, [key]: value }));
	};

	// Alternar estado do checklist (concluído/não concluído)
	const handleToggle = todoId => {
		const updatedTodos = task.todoChecklist.map(todo => (todo._id === todoId ? { ...todo, completed: !todo.completed } : todo));

		// Atualizar status
		const completedCount = updatedTodos.filter(t => t.completed).length;
		let newStatus = 'Pendente';
		if (completedCount === updatedTodos.length) newStatus = 'Concluída';
		else if (completedCount > 0) newStatus = 'Em Progresso';

		setTask(prev => ({ ...prev, todoChecklist: updatedTodos, status: newStatus }));
	};

	// Adicionar novo item ao checklist
	const handleAddTodo = () => {
		if (!newTodo.trim()) return;
		const newItem = { _id: Date.now().toString(), task: newTodo.trim(), completed: false };
		setTask(prev => ({
			...prev,
			todoChecklist: [...(prev.todoChecklist || []), newItem],
		}));
		setNewTodo('');
	};

	// Editar item do checklist
	const handleEditTodo = (todoId, value) => {
		setTask(prev => ({
			...prev,
			todoChecklist: prev.todoChecklist.map(todo => (todo._id === todoId ? { ...todo, task: value } : todo)),
		}));
	};

	// Remover item do checklist
	const handleRemoveTodo = todoId => {
		setTask(prev => ({
			...prev,
			todoChecklist: prev.todoChecklist.filter(todo => todo._id !== todoId),
		}));
	};

	// Adicionar novo anexo
	const handleAddAttachment = () => {
		if (!newAttachment.trim()) return;
		setTask(prev => ({
			...prev,
			attachments: [...(prev.attachments || []), newAttachment.trim()],
		}));
		setNewAttachment('');
	};

	// Remover anexo
	const handleRemoveAttachment = index => {
		setTask(prev => ({
			...prev,
			attachments: prev.attachments.filter((_, i) => i !== index),
		}));
	};

	// Abrir link em nova aba
	const handleLinkClick = link => {
		if (!/^https?:\/\//i.test(link)) link = 'https://' + link;
		window.open(link, '_blank');
	};

	useEffect(() => {
		if (id) getTaskDetailsByID();
	}, [id, getTaskDetailsByID]);

	if (!task) return <DashboardLayout activeMenu='Minhas Tarefas'>Carregando...</DashboardLayout>;

	return (
		<DashboardLayout activeMenu='Minhas Tarefas'>
			<div className='mt-5'>
				<div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
					<div className='form-card col-span-3'>
						{/* Título e status */}
						<div className='mt-4'>
							<label className='text-xs font-medium text-slate-600'>Título</label>
							<div className='flex items-center justify-between gap-4 mt-1'>
								<input type='text' value={task.title || ''} onChange={e => handleValueChange('title', e.target.value)} className='px-2 py-1 text-sm md:text-base font-medium rounded' />
								<div className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(task.status)} px-5 py-2 rounded`}>{task.status}</div>
							</div>
						</div>

						{/* Descrição */}
						<div className='mt-4'>
							<label className='text-xs font-medium text-slate-500'>Descrição</label>
							<textarea value={task.description || ''} onChange={e => handleValueChange('description', e.target.value)} className='px-2 py-1 rounded w-full text-sm md:text-base mt-1' />
						</div>

						{/* Prioridade, prazo e utilizadores */}
						<div className='grid grid-cols-12 gap-4 mt-4'>
							<div className='col-span-6 md:col-span-4'>
								<label className='text-xs font-medium text-slate-500'>Prioridade</label>
								<select value={task.priority || 'Média'} onChange={e => handleValueChange('priority', e.target.value)} className='border px-2 py-1 rounded w-full text-sm md:text-base mt-1'>
									<option value='Baixa'>Baixa</option>
									<option value='Média'>Média</option>
									<option value='Alta'>Alta</option>
								</select>
							</div>

							<div className='col-span-6 md:col-span-4'>
								<label className='text-xs font-medium text-slate-500'>Data Limite</label>
								<input
									type='date'
									value={task.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : ''}
									onChange={e => handleValueChange('dueDate', e.target.value)}
									className='border px-2 py-1 rounded w-full text-sm md:text-base mt-1'
								/>
							</div>

							<div className='col-span-6 md:col-span-4'>
								<label className='text-xs font-medium text-slate-500'>Atribuído a</label>
								<AvatarGroup avatars={task?.assignedTo?.map(u => u.profileImageUrl) || []} maxVisible={5} />
							</div>
						</div>

						{/* Checklist */}
						<div className='mt-4'>
							<label className='text-xs font-medium text-slate-500'>Checklist de Tarefas</label>
							{task.todoChecklist?.map(todo => (
								<div key={todo._id} className='flex items-center gap-3 p-2'>
									<input type='checkbox' checked={todo.completed} onChange={() => handleToggle(todo._id)} className='w-4 h-4 text-primary bg-gray-100 rounded-sm outline-none cursor-pointer' />
									<input
										type='text'
										value={todo.task}
										onChange={e => handleEditTodo(todo._id, e.target.value)}
										className={`px-2 py-1 rounded text-sm md:text-base flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
									/>
									<button onClick={() => handleRemoveTodo(todo._id)} className='text-red-500 text-xs px-2 py-1 rounded'>
										Remover
									</button>
								</div>
							))}
							{/* Adicionar novo item */}
							<div className='flex mt-2 gap-2'>
								<input type='text' value={newTodo} onChange={e => setNewTodo(e.target.value)} className='px-2 py-1 rounded text-sm flex-1' placeholder='Adicionar nova tarefa' />
								<button onClick={handleAddTodo} className='bg-primary text-white px-2 py-1 rounded text-sm'>
									Adicionar
								</button>
							</div>
						</div>

						{/* Anexos */}
						<div className='mt-4'>
							<label className='text-xs font-medium text-slate-500'>Anexos</label>
							{task.attachments?.map((att, index) => (
								<div key={index} className='flex items-center gap-3 p-2'>
									<span className='text-sm text-blue-600 cursor-pointer' onClick={() => handleLinkClick(att)}>
										{att}
									</span>
									<button onClick={() => handleRemoveAttachment(index)} className='text-red-500 text-xs px-2 py-1 rounded'>
										Remover
									</button>
								</div>
							))}
							<div className='flex mt-2 gap-2'>
								<input type='text' value={newAttachment} onChange={e => setNewAttachment(e.target.value)} className='px-2 py-1 rounded text-sm flex-1' placeholder='Adicionar novo anexo' />
								<button onClick={handleAddAttachment} className='bg-primary text-white px-2 py-1 rounded text-sm'>
									Adicionar
								</button>
							</div>
						</div>

						{/* Botão atualizar */}
						<button className='mt-4 px-4 py-2 bg-primary text-white rounded' onClick={updateTask} disabled={loading}>
							Salvar Alterações
						</button>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default ViewTaskDetails;
