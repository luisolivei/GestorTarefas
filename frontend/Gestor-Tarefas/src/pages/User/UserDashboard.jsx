import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth'; // Hook para garantir autenticação do utilizador
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext'; // Contexto do utilizador
import axiosInstance from '../../utils/axiosInstance'; // Axios configurado
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths'; // Endpoints da API
import moment from 'moment'; // Manipulação de datas
import { addThousandsSeparator } from '../../utils/helper'; // Função para formatar números
import InfoCard from '../../components/Cards/InfoCard'; // Card de informação
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable'; // Tabela de tarefas recentes
import CustomPieChart from '../../components/Charts/CustomPieChart'; // Gráfico circular
import CustomBarChart from '../../components/Charts/CustomBarChart'; // Gráfico de barras

const COLORS = ['#8D51FF', '#00B8DB', '#7BCE00']; // Cores do gráfico pie chart

const UserDashboard = () => {
	useUserAuth(); // Garante que o utilizador está autenticado
	const { user } = useContext(UserContext); // Obter dados do utilizador

	const navigate = useNavigate(); // Hook de navegação

	// Estados para armazenar os dados do dashboard e dos gráficos
	const [dashboardData, setDashboardData] = useState(null);
	const [pieChartData, setPieChartData] = useState([]);
	const [barChartData, setBarChartData] = useState([]);

	// Preparar dados para os gráficos
	const prepareChartData = data => {
		const taskDistribution = data?.taskDistribution || null; // Distribuição de tarefas por estado
		const taskPriorityLevels = data?.taskPriorityLevels || null; // Distribuição de tarefas por prioridade

		// Dados para gráfico circular (status das tarefas)
		const taskDistributionData = [
			{ status: 'Pendente', count: taskDistribution?.Pendente || 0 },
			{ status: 'Em Progresso', count: taskDistribution?.EmProgresso || 0 },
			{ status: 'Concluída', count: taskDistribution?.Concluída || 0 },
		];
		setPieChartData(taskDistributionData);

		// Dados para gráfico de barras (nível de prioridade)
		const PriorityLevelData = [
			{ priority: 'Baixa', count: taskPriorityLevels?.Baixa || 0 },
			{ priority: 'Media', count: taskPriorityLevels?.Media || 0 },
			{ priority: 'Alta', count: taskPriorityLevels?.Alta || 0 },
		];
		setBarChartData(PriorityLevelData);
	};

	// Função para buscar os dados do dashboard do utilizador
	const getDashboardData = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
			if (response.data) {
				setDashboardData(response.data); // Guarda os dados do dashboard
				prepareChartData(response.data?.charts || null); // Prepara os gráficos
			}
		} catch (error) {
			console.error('Erro ao obter dados do dashboard:', error);
		}
	};

	// Navegar para a lista completa de tarefas
	const onSeeMore = () => {
		navigate('/user/tasks');
	};

	// useEffect para buscar os dados ao montar o componente
	useEffect(() => {
		getDashboardData();
		return () => {};
	}, []);

	return (
		<DashboardLayout activeMenu='Painel'>
			{/* Boas-vindas e data atual */}
			<div className='card my-5'>
				<div>
					<div className='col-span-3'>
						<h2 className='text-xl md:text-2xl'>Bem vindo! {user?.name}</h2>
						<p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>{moment().format('dddd Do MMM YYYY')}</p>
					</div>
				</div>

				{/* Cards de informação sobre tarefas */}
				<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
					<InfoCard label='Total Tasks' value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Total || 0)} color='bg-primary' />
					<InfoCard label='Tarefas Pendentes' value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pendente || 0)} color='bg-violet-500' />
					<InfoCard label='Em Progresso' value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.EmProgresso || 0)} color='bg-cyan-500' />
					<InfoCard label='Tarefas Concluídas' value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Concluída|| 0)} color='bg-lime-500' />
				</div>
			</div>

			{/* Gráficos e tabela de tarefas recentes */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
				{/* Gráfico circular */}
				<div>
					<div className='card'>
						<div className='flex items-center justify-between'>
							<h5 className='font-medium'>Distribuição de Tarefas</h5>
						</div>
						<CustomPieChart data={pieChartData} colors={COLORS} />
					</div>
				</div>

				{/* Gráfico de barras */}
				<div>
					<div className='card'>
						<div className='flex items-center justify-between'>
							<h5 className='font-medium'>Niveis de Prioridade</h5>
						</div>
						<CustomBarChart data={barChartData} />
					</div>
				</div>

				{/* Tabela de tarefas recentes */}
				<div className='md:col-span-2'>
					<div className='card'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Tarefas Recentes</h5>
							<button className='card-btn' onClick={onSeeMore}>
								Ver Mais <LuArrowRight className='text-base' />
							</button>
						</div>
						<TaskListTable tableData={dashboardData?.recentTasks || []} />
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default UserDashboard;
