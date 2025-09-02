
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

// Componente de gráfico circular (donut chart) personalizado
// Props:
//   - data   → array de objetos { status, count }
//   - colors → array de cores para preencher as fatias
const CustomPieChart = ({ data, colors }) => {
	return (
		// Contêiner responsivo → adapta o gráfico à largura do ecrã
		<ResponsiveContainer width='100%' height={325}>
			<PieChart>
				{/* Gráfico em forma de "donut" */}
				<Pie
					data={data} // dados a representar
					dataKey='count' // valor numérico
					nameKey='status' // label (nome da categoria)
					cx='50%'
					cy='50%' // posição no centro
					outerRadius={130} // raio exterior (tamanho do donut)
					innerRadius={100} // raio interior (buraco no meio)
					labelLine={false} // remove linha de ligação da label
				>
					{/* Aplica cor a cada fatia do gráfico */}
					{data.map((_, index) => (
						<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
					))}
				</Pie>
				{/* Tooltip personalizado → aparece ao passar o rato */}
				<Tooltip content={<CustomTooltip />} />
				{/* Legenda personalizada → substitui a default do Recharts */}
				<Legend content={<CustomLegend />} />
			</PieChart>
		</ResponsiveContainer>
	);
};

export default CustomPieChart;
