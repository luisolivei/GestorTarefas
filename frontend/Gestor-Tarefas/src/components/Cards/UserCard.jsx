// Componente principal: cartão de utilizador
// Recebe como prop "userInfo", com dados do utilizador e estatísticas
const UserCard = ({ userInfo }) => {
	return (
		<div className='user-card p-2'>
			{/* Secção superior: avatar + nome + email */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					{/* Se o utilizador tiver foto de perfil, mostra a imagem */}
					{userInfo?.profileImageUrl ? (
						<img src={userInfo.profileImageUrl} alt={'Avatar'} className='w-12 h-12 rounded-full' />
					) : (
						// Caso contrário, mostra um círculo cinzento como "placeholder"
						<div className='w-12 h-12 rounded-full bg-gray-200 border-2 border-white' />
					)}
					{/* Nome e email */}
					<div>
						<p className='text-sm font-medium'>{userInfo?.name}</p>
						<p className='text-xs text-gray-500'>{userInfo?.email}</p>
					</div>
				</div>
			</div>
			{/* Secção : estatísticas das tarefas */}
			<div className='flex items-end gap-3 mt-5'>
				<StatCard label='Pending' count={userInfo?.pendingTasks || 0} status='Pending' />
				<StatCard label='In Progress' count={userInfo?.inProgressTasks || 0} status='In progress' />
				<StatCard label='Completed' count={userInfo?.completedTasks || 0} status='Completed' />
			</div>
		</div>
	);
};

export default UserCard;

// Componente auxiliar para mostrar estatísticas de tarefas
// Recebe: label (texto), count (número), status (estado da tarefa)
const StatCard = ({ label, count, status }) => {
    // Função: define a cor do "tag" de acordo com o estado da tarefa
	const getStatusTagColor = () => {
		switch (status) {
			case 'In progress':
				return 'text-cyan-500 bg-gray-50';

			case 'Completed':
				return 'text-indigo-500 bg-gray-50';

			default:
				return 'text-violet-500 bg-gray-50';
		}
	};

	return (
		<div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
			{/* Número de tarefas em destaque */}
            <span className='text-[12px] font-semibold'> {count} </span> <br />
            {/* Nome do estado */}
            {label}
		</div>
	);
};
