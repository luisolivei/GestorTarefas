import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

// Componente principal para visualizar os detalhes de uma tarefa
const ViewTaskDetails = () => {
	const { id } = useParams(); // Pega o ID da tarefa da rota
	const [task, setTask] = useState(null); // Estado para guardar os detalhes da tarefa

	// Função para determinar a cor da etiqueta com base no status da tarefa
	const getStatusTagColor = status => {
		switch (status) {
			case 'In Progress':
				return 'bg-cyan-50 text-cyan-500 border border-cyan-500/10';
			case 'Completed':
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
				setTask(taskInfo); // Atualiza o estado com a tarefa obtida
			}
		} catch (error) {
			console.error('Error fetching task details:', error);
		}
	}, [id]);

	// Função para alternar o estado de uma tarefa do checklist (concluída ou não)
	const handleToggle = async todoId => {
		// Atualiza o checklist localmente
		const updatedTodos = task.todoChecklist.map(todo => (todo._id === todoId ? { ...todo, completed: !todo.completed } : todo));

		// Conta quantos estão completos
		const completedCount = updatedTodos.filter(todo => todo.completed).length;

		// Determina o novo status da tarefa
		let newStatus = 'Pending';
		if (completedCount === updatedTodos.length) {
			newStatus = 'Completed';
		} else if (completedCount > 0) {
			newStatus = 'In Progress';
		}

		// Atualiza o estado local
		setTask(prev => ({
			...prev,
			todoChecklist: updatedTodos,
			status: newStatus,
		}));

		// Atualiza o backend
		try {
			await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(task._id), {
				todoChecklist: updatedTodos,
				status: newStatus,
			});
		} catch (error) {
			console.error('Error updating task:', error);
		}
	};

	// Função para abrir links de anexos numa nova aba
	const handleLinkClick = link => {
		if (!/^https?:\/\//i.test(link)) {
			link = 'https://' + link; // Garantir que o link é completo
		}
		window.open(link, '_blank');
	};

	// Buscar os detalhes da tarefa ao montar o componente
	useEffect(() => {
		if (id) {
			getTaskDetailsByID();
		}
		return () => {};
	}, [id, getTaskDetailsByID]);

	return (
		<DashboardLayout activeMenu={'My Tasks'}>
			<div className='mt-5'>
				{task && (
					<div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
						<div className='form-card col-span-3'>
							{/* Cabeçalho com título e status */}
							<div className='flex items-center justify-between'>
								<h2 className='text-sm md:text-xl font-medium'>{task?.title}</h2>
								<div className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(task?.status)} px-4 py-0.5 rounded`}>{task?.status}</div>
							</div>

							{/* Descrição da tarefa */}
							<div className='mt-4'>
								<InfoBox label='Description' value={task?.description} />
							</div>

							{/* Prioridade, prazo e utilizadores atribuídos */}
							<div className='grid grid-cols-12 gap-4 mt-4'>
								<div className='col-span-6 md:col-span-4'>
									<InfoBox label='Priority' value={task?.priority} />
								</div>
								<div className='col-span-6 md:col-span-4'>
									<InfoBox label='Due Date' value={task?.dueDate ? moment(task?.dueDate).format('Do MMM YYYY') : 'N/A'} />
								</div>
								<div className='col-span-6 md:col-span-4'>
									<label className='text-xs font-medium text-slate-500'>Atribuído a</label>
									<AvatarGroup avatars={task?.assignedTo?.map(item => item?.profileImageUrl) || []} maxVisible={5} />
								</div>
							</div>

							{/* Checklist de tarefas */}
							<div className='mt-2'>
								<label className='text-xs font-medium text-slate-500'>Checklist de Tarefas</label>
								{task?.todoChecklist?.map(todo => (
									<TodoChecklist key={todo._id} task={todo.task} isChecked={todo.completed} onChange={() => handleToggle(todo._id)} />
								))}
							</div>

							{/* Anexos */}
							{task?.attachments?.length >= 0 && (
								<div className='mt-2'>
									<label className='text-xs font-medium text-slate-500'>Anexos</label>
									{task?.attachments?.map((link, index) => (
										<Attachment key={`link_${index}`} link={link} index={index} onClick={() => handleLinkClick(link)} />
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
};

export default ViewTaskDetails;

// Componente reutilizável para mostrar label e valor
const InfoBox = ({ label, value }) => {
	return (
		<>
			<label className='text-xs font-medium text-slate-500'>{label}</label>
			<p className='text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5'>{value}</p>
		</>
	);
};

// Componente para cada item do checklist de tarefas
const TodoChecklist = ({ task, isChecked, onChange }) => {
	return (
		<div className='flex items-center gap-3 p-3'>
			<input type='checkbox' checked={isChecked} onChange={onChange} className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer' />
			<p className='text-[12px] md:text-[13px] font-medium text-gray-700'>{task}</p>
		</div>
	);
};

// Componente para anexos com link clicável
const Attachment = ({ link, index, onClick }) => {
	return (
		<div className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer' onClick={onClick}>
			<div className='flex-1 flex items-center gap-3'>
				<span className='text-xs text-gray-400 font-semibold mr-2'>{index < 9 ? `0${index + 1}` : index + 1}</span>
				<p className='text-xs text-black'>{link}</p>
			</div>
			<LuSquareArrowOutUpRight className='text-gray-400' />
		</div>
	);
};
