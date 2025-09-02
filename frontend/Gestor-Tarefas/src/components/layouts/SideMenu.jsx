import { useNavigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext'; // contexto do utilizador
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

// Componente do menu lateral (SideMenu)
// Props:
//   - activeMenu → indica qual o menu ativo para destacar a opção correspondente
const SideMenu = ({ activeMenu }) => {
	const { user, clearUser } = useContext(UserContext); // acede ao utilizador e função de logout
	const [sideMenuData, setSideMenuData] = useState([]); // dados do menu a mostrar

	const navigate = useNavigate(); // hook do react-router para navegação

	// Função para tratar cliques nas opções do menu
	const handleClick = route => {
		if (route === 'logout') {
			handleLogout();
			return;
		}
		navigate(route);
	};

	// Função para fazer logout do utilizador
	const handleLogout = async () => {
		try {
			localStorage.clear(); // limpa localStorage (ou cookies via backend)
			clearUser(); // limpa contexto do utilizador
			navigate('/login'); // redireciona para login
		} catch (error) {
			console.error('Erro ao fazer logout', error);
		}
	};

	// Define os dados do menu com base no papel do utilizador
	useEffect(() => {
		if (user) {
			setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
		}
	}, [user]);

	return (
		<div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
			{/* Área do avatar e informações do utilizador */}
			<div className='flex flex-col items-center justify-center mb-7 pt-5'>
				<div className='relative'>
					{user?.profileImageUrl ? <img src={user.profileImageUrl} alt='Avatar' className='w-12 h-12 rounded-full' /> : <div className='w-12 h-12 rounded-full bg-gray-200 border-2 border-white' />}
				</div>

				{/* Badge de Admin */}
				{user?.role === 'admin' && <div className='text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1'>Admin</div>}

				{/* Nome e email do utilizador */}
				<h5 className='text-gray-950 font-medium leading-6 mt-3'>{user?.name || ''}</h5>
				<p className='text-[12px] text-gray-500'>{user?.email || ''}</p>
			</div>

			{/* Lista de opções do menu */}
			{sideMenuData.map((item, index) => (
				<button
					key={`menu_${index}`}
					className={`w-full flex items-center gap-4 text-[15px] ${
						activeMenu === item.label ? 'text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3' : ''
					} py-3 px-6 mb-3 cursor-pointer`}
					onClick={() => handleClick(item.path)}
				>
					{/* Ícone da opção */}
					<item.icon className='text-xl' />
					{item.label}
				</button>
			))}
		</div>
	);
};

export default SideMenu;
