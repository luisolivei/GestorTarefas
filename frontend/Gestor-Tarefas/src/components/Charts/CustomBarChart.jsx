
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Componente personalizado de gráfico de barras
// Props: data → array de objetos com { priority, count }
const CustomBarChart = ({ data }) => {
	// Função auxiliar: devolve cor da barra consoante a prioridade
	const getBarColor = entry => {
		switch (entry?.priority) {
			case 'Low':
				return '#00BC7D';
			case 'Medium':
				return '#FE9900';
			case 'High':
				return '#FF1F57';
			default:
				return '#00BC7D';
		}
	};

	// Tooltip personalizado para mostrar detalhes ao passar o rator sobre uma barra
	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
					{/* Mostra a prioridade */}
                    <p className='text-xs font-semibold text-purple-800 mb-1'>{payload[0].payload.priority}</p>
                    {/* Mostra a contagem */}
					<p className='text-sm text-gray-600'>
						Count: <span className='text-sm font-medium text-gray-900'>{payload[0].payload.count}</span>
					</p>
				</div>
			);
		}
		return null;
	};
	return (
		<div className='ng-white mt-6'>
			{/* Contêiner responsivo → adapta o gráfico ao tamanho do ecrã */}
			<ResponsiveContainer width='100%' height={300}>
				<BarChart data={data}>
					{/* Grade do gráfico (desativado stroke) */}
					<CartesianGrid stroke='none' />
					{/* Eixo X → mostra prioridades */}
					<XAxis dataKey='priority' tick={{ fontSize: 12, fill: '#555' }} stroke='none' />
					{/* Eixo Y → mostra contagem */}
					<YAxis tick={{ fontSize: 12, fill: '#555' }} stroke='none' />
					{/* Tooltip customizado */}
					<Tooltip content={CustomTooltip} cursor={{ fill: 'transparent' }} />
					{/* Barras do gráfico */}
					<Bar dataKey='count' nameKey='priority' fill='#FF8042' radius={[10, 10, 0, 0]} activeDot={{ r: 8, fill: 'yellow' }} activeStyle={{ fill: 'green' }}>
						{/* Define cor de cada barra dinamicamente */}
						{data.map((entry, index) => (
							<Cell key={index} fill={getBarColor(entry)} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

export default CustomBarChart
