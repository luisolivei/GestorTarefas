// Componente CustomLegend → cria uma legenda personalizada para gráficos
// Props: payload → array de itens de legenda fornecido pelo Recharts
const CustomLegend = ({ payload }) => {
  return (
		// Contêiner da legenda → flexível, centrado, com espaçamento
		<div className='flex flex-wrap justify-center gap-2 mt-4 space-x-6'>
			{/* Itera sobre cada item da legenda */}
			{payload.map((entry, index) => (
				<div key={`legend-${index}`} className='flex items-center space-x-2'>
					{/* Círculo colorido que representa a cor da série */}
					<div className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: entry.color }}></div>
					{/* Texto associado ao item da legenda */}
					<span className='text-xs text-gray-700 font-medium'>{entry.value}</span>
				</div>
			))}
		</div>
	);
};

export default CustomLegend;
