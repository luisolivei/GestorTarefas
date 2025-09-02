import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import { addThousandsSeparator } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ['#8D51FF', '#00B8DB', '#7BCE00'];

const Dashboard = () => {
	useUserAuth(); // garante que o utilizador está autenticado
	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	const [dashboardData, setDashboardData] = useState(null); // dados gerais do dashboard
	const [pieChartData, setPieChartData] = useState([]); // dados para gráfico circular
	const [barChartData, setBarChartData] = useState([]); // dados para gráfico de barras

	// Prepara os dados para os gráficos
	const prepareChartData = data => {
		const taskDistribution = data?.taskDistribution || null; // distribuição de tarefas por estado
		const taskPriorityLevels = data?.taskPriorityLevels || null; // níveis de prioridade das tarefas

		// Dados para o gráfico circular (estado das tarefas)
		const taskDistributionData = [
			{ status: 'Pending', count: taskDistribution?.Pending || 0 },
			{ status: 'In Progress', count: taskDistribution?.InProgress || 0 },
			{ status: 'Completed', count: taskDistribution?.Completed || 0 },
		];

		setPieChartData(taskDistributionData);

		// Dados para o gráfico de barras (prioridade das tarefas)
		const PriorityLevelData = [
			{ priority: 'Low', count: taskPriorityLevels?.Low || 0 },
			{ priority: 'Medium', count: taskPriorityLevels?.Medium || 0 },
			{ priority: 'High', count: taskPriorityLevels?.High || 0 },
		];

		setBarChartData(PriorityLevelData);
	};

	// Obter dados do dashboard através da API
	const getDashboardData = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
			if (response.data) {
				setDashboardData(response.data);
				prepareChartData(response.data?.charts || null);
			}
		} catch (error) {
			console.error('Erro ao obter dados do dashboard:', error);
		}
	};

	const onSeeMore = () => {
		navigate('/admin/tasks'); // navegar para página com todas as tarefas
	};

	useEffect(() => {
		getDashboardData(); // carrega dados ao montar componente
		return () => {};
	}, []);

	return (
		<DashboardLayout activeMenu='Dashboard'>
			<div className='card my-5'>
				<div>
					<div className='col-span-3'>
						<h2 className='text-xl md:text-2xl'>Bem vindo! {user?.name}</h2>
						<p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>{moment().format('dddd Do MMM YYYY')}</p>
					</div>
				</div>
				<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
					{/* Cartões informativos */}
					<InfoCard label='Total Tasks' value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)} color='bg-primary' />
					<InfoCard label='Pending Tasks' value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)} color='bg-violet-500' />
					<InfoCard label='In Progress' value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)} color='bg-cyan-500' />
					<InfoCard label='Completed Tasks' value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)} color='bg-lime-500' />
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
				<div>
					<div className='card'>
						<div className='flex items-center justify-between'>
							<h5 className='font-medium'>Distribuição de Tarefas</h5>
						</div>
						{/* Gráfico circular */}
						<CustomPieChart data={pieChartData} colors={COLORS} />
					</div>
				</div>

				<div>
					<div className='card'>
						<div className='flex items-center justify-between'>
							<h5 className='font-medium'>Níveis de Prioridade da Tarefa</h5>
						</div>
						{/* Gráfico de barras */}
						<CustomBarChart data={barChartData} />
					</div>
				</div>

				<div className='md:col-span-2'>
					<div className='card'>
						<div className='flex items-center justify-between'>
							<h5 className='text-lg'>Tarefas Recentes</h5>
							{/* Botão para ver todas as tarefas */}
							<button className='card-btn' onClick={onSeeMore}>
								Ver Todas <LuArrowRight className='text-base' />
							</button>
						</div>
						{/* Tabela com as tarefas recentes */}
						<TaskListTable tableData={dashboardData?.recentTasks || []} />
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Dashboard;
