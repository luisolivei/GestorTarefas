// Componente de barra de progresso
// Props:
//   - progress → valor da percentagem de conclusão (0 a 100)
//   - status   → estado da tarefa, usado para definir a cor da barra
const Progress = ({ progress, status }) => {
	// Função para determinar a cor da barra conforme o status
	const getColor = () => {
		switch (status) {
			case 'In Progress':
				return 'text-cyan-500 bg-cyan-500 border border-cyan-500/10'; // Em progresso
			case 'Completed':
				return 'text-indigo-500 bg-indigo-500 border border-indigo-500/10'; // Concluído
			default:
				return 'text-violet-500 bg-violet-500 border border-violet-500/10'; // Outro estado
		}
	};

	return (
		// Contêiner da barra de progresso
		<div className='w-full bg-gray-200 rounded-full h-1.5'>
			{/* Barra preenchida com largura baseada na percentagem de progresso */}
			<div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{ width: `${progress}%` }}></div>
		</div>
	);
};

export default Progress;
