import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";


const ManageUsers = () => {
	const [allUsers, setAllUsers] = useState([]);

	// Buscar todos os utilizadores
	const getAllUsers = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
			if (response.data?.length > 0) {
				setAllUsers(response.data);
			}
		} catch (error) {
			console.error('Erro ao buscar utilizadores:', error);
		}
	};

	// Descarregar relatório de utilizadores
	const handleDownloadReport = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
				responseType: 'blob', // Importante para ficheiro binário
			});

			// Criar URL para o ficheiro
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'users_report.xlsx'); // ou outra extensão
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Erro ao descarregar o relatório:', error);
			toast.error('Falha ao descarregar o relatório. Tente novamente.');
		}
	};

	useEffect(() => {
		getAllUsers();
		return () => {};
	}, []);

	return (
		<DashboardLayout activeMenu='Membros da equipa'>
			<div className='mt-5 mb-10'>
				<div className='flex md:flex-row md:items-center justify-between'>
					<h2 className='text-xl md:text-xl font-medium'>Membros da Equipa</h2>

					{/* Botão de descarregar relatório */}
					<button className='flex md:flex download-btn' onClick={handleDownloadReport}>
						<LuFileSpreadsheet className='text-lg' />
						Download Relatório
					</button>
				</div>

				{/* Lista de cartões de utilizadores */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
					{allUsers?.map(user => (
						<UserCard key={user._id} userInfo={user} />
					))}
				</div>
			</div>
		</DashboardLayout>
	);
};
export default ManageUsers
