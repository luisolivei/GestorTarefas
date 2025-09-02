// Componente de tabs para filtrar tarefas por estado
// Props:
//   - tabs      → array de objetos { label, count }, ex: { label: 'Em Progresso', count: 5 }
//   - activeTab → label da tab ativa
//   - setActiveTab → função para atualizar a tab ativa
const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
	return (
		<div className='my-2'>
			<div className='flex'>
				{tabs.map(tab => (
					<button
						key={tab.label}
						className={`relative px-3 md:px-4 py-2 text-sm font-medium 
                            ${activeTab === tab.label ? 'text-primary' : 'text-gray-500 hover:bg-gray-700'} cursor-pointer`}
						onClick={() => setActiveTab(tab.label)} // Atualiza a tab ativa ao clicar
					>
						<div className='flex items-center'>
							{/* Label da tab */}
							<span className='text-xs'>{tab.label}</span>

							{/* Badge com contagem de tarefas */}
							<span
								className={`text-xs ml-2 px-2 py-0.5 rounded-full 
                                ${activeTab === tab.label ? 'bg-primary text-white' : 'bg-gray-200/70 text-gray-600'}`}
							>
								{tab.count}
							</span>
						</div>

						{/* Linha indicadora da tab ativa */}
						{activeTab === tab.label && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-primary'></div>}
					</button>
				))}
			</div>
		</div>
	);
};

export default TaskStatusTabs;
