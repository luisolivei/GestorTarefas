
// Componente CustomTooltip → tooltip personalizado para gráficos do Recharts
// Props:
//   - active  → indica se o tooltip deve estar visível
//   - payload → array de dados do ponto/fatia sobre o qual se passa o rato
const CustomTooltip = ({ active, payload}) => {
	if (active && payload && payload.length) {
		return (
			<div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
				{/* Nome do item (ex.: categoria, status, etc.) */}
				<p className='text-xs font-semibold text-purple-800 mb-1'>{payload[0].payload.name}</p>
				{/* Valor associado (número de ocorrências, percentagem, etc.) */}
				<p className='text-sm text-gray-600'>
					Total: <span className='text-sm font-medium text-gray-900'>{payload[0].value}</span>
				</p>
			</div>
		);
	}
	// Se não estiver ativo → não renderiza nada
	return null;
}

export default CustomTooltip
