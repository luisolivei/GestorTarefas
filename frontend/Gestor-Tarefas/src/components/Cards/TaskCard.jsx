import Progress from '../Progress';
import AvatarGroup from '../AvatarGroup';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';

// Componente TaskCard
// Props: título, descrição, prioridade, estado, datas, responsáveis, anexos, progresso e evento de clique
const TaskCard = ({ title, description, priority, status, createdAt, dueDate, assignedTo, attachmentCount, completedTodoCount, todoChecklist, onClick }) => {
	// Função: define a cor do "tag" de acordo com o estado da tarefa
	const getStatusTagColor = () => {
		switch (status) {
			case 'Em Progresso':
				return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
			case 'Concluída':
				return 'text-lime-500 bg-lime-50 border border-lime-500/20';
			default:
				return 'text-violet-500 bg-violet-50 border border-violet-500/10';
		}
	};

	// Função : define a cor do "tag" de acordo com a prioridade da tarefa
	const getPriorityTagColor = () => {
		switch (priority) {
			case 'Baixa':
				return 'text-emerald-500 bg-emerald-50 border border-emerald-500/10';
			case 'Media':
				return 'text-amber-500 bg-amber-50 border border-amber-500/10';
			default:
				return 'text-rose-500 bg-rose-50 border border-rose-500/10';
		}
	};

	//  Calculo do progresso real com base no checklist
	const totalTodos = todoChecklist?.length ?? 0;
	const percent = totalTodos > 0 ? (completedTodoCount / totalTodos) * 100 : 0;

	return (
		// Cartão principal da tarefa
		<div className='bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer' onClick={onClick}>
			{/* Secção das "tags" de estado e prioridade */}
			<div className='flex items-end gap-3 px-4'>
				<div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>{status}</div>
				<div className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}>{priority} Prioridade</div>
			</div>
			{/* Conteúdo principal da tarefa */}
			<div className={`px-4 border-l-[3px] ${status === 'Em Progresso' ? 'border-cyan-500' : status === 'Concluída' ? 'border-indigo-500' : 'border-violet-500'}`}>
				{/* Título */}
				<p className='text-sm font-medium text-gray-800 mt-4 line-clamp-2'>{title}</p>
				{/* Descrição */}
				<p className='text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>{description}</p>
				{/* Progresso do checklist */}
				<p className='text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]'>
					Tarefa Concluída:{' '}
					<span className='font-semibold text-gray-700'>
						{completedTodoCount}/{totalTodos}
					</span>
				</p>

				{/* Barra de progresso calculada dinamicamente */}
				<Progress progress={percent} status={status} />
			</div>
			{/* Datas e utilizadores atribuídos */}
			<div className='px-4'>
				<div className='flex items-center justify-between my-1'>
					<div>
						<label className='text-xs text-gray-500'>Data de criação</label>
						<p className='text-[13px] font-medium text-gray-900'>{moment(createdAt).format('Do MMM YYYY')}</p>
					</div>

					<div>
						<label className='text-xs text-gray-500'>Prazo de entrega</label>
						<p className='text-[13px] font-medium text-gray-900'>{moment(dueDate).format('Do MMM YYYY')}</p>
					</div>
				</div>
				{/* Grupo de avatares + anexos */}
				<div className='flex items-center justify-between mt-3'>
					<AvatarGroup avatars={assignedTo || []} />
					{/* Mostra o ícone e número de anexos, apenas se existirem */}
					{attachmentCount > 0 && (
						<div className='flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg'>
							<LuPaperclip className='text-primary' /> {''}
							<span className='text-xs text-gray-900'>{attachmentCount}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskCard;
