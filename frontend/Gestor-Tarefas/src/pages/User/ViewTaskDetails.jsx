import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment/min/moment-with-locales';
import AvatarGroup from '../../components/AvatarGroup';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

moment.locale('pt');

// Componente principal para visualizar e editar os detalhes de uma tarefa
const ViewTaskDetails = () => {
	const { id } = useParams(); // Pega o ID da tarefa da rota
	const [task, setTask] = useState(null); // Estado para guardar os detalhes da tarefa
	const [editableTask, setEditableTask] = useState(null); // Estado para edição da tarefa
	const [newAttachment, setNewAttachment] = useState(''); // Estado temporário para novo anexo
	const [newTodo, setNewTodo] = useState(''); // Estado temporário para novo item do checklist

	// Função para determinar a cor da etiqueta com base no status da tarefa
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

	// Função para buscar os detalhes da tarefa pelo ID
	const getTaskDetailsByID = useCallback(async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
			if (response.data) {
				const taskInfo = response.data;
				setTask(taskInfo); // Atualiza a tarefa principal
				setEditableTask(taskInfo); // Inicializa a versão editável
			}
		} catch (error) {
			console.error('Erro ao buscar detalhes da tarefa:', error);
		}
	}, [id]);

	// Alterna o estado de um item do checklist (concluído/não concluído)
	const handleToggle = todoId => {
		const updatedTodos = editableTask.todoChecklist.map(todo => (todo._id === todoId ? { ...todo, completed: !todo.completed } : todo));

		// Conta quantos estão completos
		const completedCount = updatedTodos.filter(todo => todo.completed).length;

		// Determina o novo status da tarefa
		let newStatus = 'Pendentes';
		if (completedCount === updatedTodos.length) {
			newStatus = 'Concluída';
		} else if (completedCount > 0) {
			newStatus = 'Em Progresso';
		}

		// Atualiza o estado local
		setEditableTask(prev => ({
			...prev,
			todoChecklist: updatedTodos,
			status: newStatus,
		}));
	};

	// Adicionar novo item ao checklist
	const handleAddTodo = () => {
		if (!newTodo.trim()) return;
		const newItem = { _id: Date.now().toString(), task: newTodo.trim(), completed: false };
		setEditableTask(prev => ({
			...prev,
			todoChecklist: [...(prev.todoChecklist || []), newItem],
		}));
		setNewTodo('');
	};

	// Editar item existente do checklist
	const handleEditTodo = (todoId, value) => {
		setEditableTask(prev => ({
			...prev,
			todoChecklist: prev.todoChecklist.map(todo => (todo._id === todoId ? { ...todo, task: value } : todo)),
		}));
	};

	// Remover item do checklist
	const handleRemoveTodo = todoId => {
		setEditableTask(prev => ({
			...prev,
			todoChecklist: prev.todoChecklist.filter(todo => todo._id !== todoId),
		}));
	};

	// Salvar alterações feitas pelo utilizador
	const handleSave = async () => {
		try {
			await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(task._id), editableTask);
			setTask(editableTask); // Atualiza a tarefa principal
			alert('Tarefa atualizada com sucesso!');
		} catch (error) {
			console.error('Erro ao atualizar tarefa:', error);
			alert('Erro ao atualizar a tarefa.');
		}
	};

	// Abrir links de anexos numa nova aba
	const handleLinkClick = link => {
		if (!/^https?:\/\//i.test(link)) {
			link = 'https://' + link; // Garantir que o link é completo
		}
		window.open(link, '_blank');
	};

	// Adicionar novo anexo
	const handleAddAttachment = () => {
		if (!newAttachment) return;
		setEditableTask(prev => ({
			...prev,
			attachments: [...(prev.attachments || []), newAttachment],
		}));
		setNewAttachment('');
	};

	// Remover anexo existente
	const handleRemoveAttachment = index => {
		setEditableTask(prev => ({
			...prev,
			attachments: prev.attachments.filter((_, i) => i !== index),
		}));
	};

	useEffect(() => {
		if (id) getTaskDetailsByID();
	}, [id, getTaskDetailsByID]);

	return (
		<DashboardLayout activeMenu={'Minhas Tarefas'}>
			<div className='mt-5'>
				{editableTask && (
					<div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
						<div className='form-card col-span-3'>
							{/* Cabeçalho com título e status */}
							<div className='mt-4'>
								<label className='text-xs font-medium text-slate-600'>Título</label>
								<div className='flex items-center justify-between gap-4 mt-1'>
									<input
										type='text'
										value={editableTask?.title || ''}
										onChange={e => setEditableTask(prev => ({ ...prev, title: e.target.value }))}
										className='px-2 py-1 text-sm md:text-base font-medium rounded w-full'
									/>
									<div className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(editableTask?.status)} px-4 py-0.5 rounded`}>{editableTask?.status}</div>
								</div>
							</div>

							{/* Descrição da tarefa */}
							<div className='mt-4'>
								<label className='text-xs font-medium text-slate-500'>Descrição</label>
								<textarea
									value={editableTask?.description || ''}
									onChange={e => setEditableTask(prev => ({ ...prev, description: e.target.value }))}
									className='px-2 py-1 rounded w-full text-sm md:text-base mt-1'
								/>
							</div>

							{/* Prioridade, prazo e utilizadores */}
							<div className='grid grid-cols-12 gap-4 mt-4'>
								<div className='col-span-6 md:col-span-4'>
									<label className='text-xs font-medium text-slate-500'>Prioridade</label>
									<select
										value={editableTask?.priority || 'Média'}
										onChange={e => setEditableTask(prev => ({ ...prev, priority: e.target.value }))}
										className='border px-2 py-1 rounded w-full text-sm md:text-base mt-1'
									>
										<option value='Baixa'>Baixa</option>
										<option value='Média'>Média</option>
										<option value='Alta'>Alta</option>
									</select>
								</div>

								<div className='col-span-6 md:col-span-4'>
									<label className='text-xs font-medium text-slate-500'>Data Limite</label>
									<input
										type='date'
										value={editableTask?.dueDate ? moment(editableTask?.dueDate).format('YYYY-MM-DD') : ''}
										onChange={e => setEditableTask(prev => ({ ...prev, dueDate: e.target.value }))}
										className='border px-2 py-1 rounded w-full text-sm md:text-base mt-1'
									/>
								</div>

								<div className='col-span-6 md:col-span-4'>
									<label className='text-xs font-medium text-slate-500'>Atribuído a</label>
									<AvatarGroup avatars={editableTask?.assignedTo?.map(item => item?.profileImageUrl) || []} maxVisible={5} />
								</div>
							</div>

							{/* Checklist de tarefas */}
							<div className='mt-4'>
								<label className='text-xs font-medium text-slate-500'>Checklist de Tarefas</label>
								{editableTask?.todoChecklist?.map(todo => (
									<div key={todo._id} className='flex items-center gap-3 p-2'>
										<input type='checkbox' checked={todo.completed} onChange={() => handleToggle(todo._id)} className='w-4 h-4 text-primary bg-gray-100 rounded-sm outline-none cursor-pointer' />
										<input
											type='text'
											value={todo.task}
											onChange={e => handleEditTodo(todo._id, e.target.value)}
											className={`px-2 py-1 rounded text-sm md:text-base flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
										/>
										<button className='text-red-500 px-2 py-1 text-xs rounded' onClick={() => handleRemoveTodo(todo._id)}>
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
								{editableTask?.attachments?.map((link, index) => (
									<div key={`link_${index}`} className='flex items-center gap-2 mb-2'>
										<p className='text-xs text-black flex-1 cursor-pointer' onClick={() => handleLinkClick(link)}>
											{link}
										</p>
										<button className='text-red-500 text-xs px-2 py-1 border rounded' onClick={() => handleRemoveAttachment(index)}>
											Remover
										</button>
									</div>
								))}
								<div className='flex mt-2 gap-2'>
									<input type='text' value={newAttachment} onChange={e => setNewAttachment(e.target.value)} className='px-2 py-1 rounded text-sm flex-1' placeholder='Adicionar novo link' />
									<button onClick={handleAddAttachment} className='bg-primary text-white px-2 py-1 rounded text-sm'>
										Adicionar
									</button>
								</div>
							</div>

							{/* Botão de salvar alterações */}
							<button className='mt-4 px-4 py-2 bg-primary text-white rounded' onClick={handleSave}>
								Salvar Alterações
							</button>
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
};

export default ViewTaskDetails;
