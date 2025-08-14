import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
	const { user, clearUser } = useContext(UserContext);
	const [ sideMenuData, setSideMenuData ] = useState([]);

	const navigate = useNavigate();

	const handleClick = route => {
		if (route === 'logout') {
			handleLogout();
			return;
		}

		navigate(route);
	};

	const handleLogout = async () => {
		try {
			// Chama API de logout para limpar cookie HttpOnly
			await axiosInstance.post('/auth/logout');
			clearUser(); // limpa contexto
			navigate('/login');
		} catch (error) {
			console.error('Erro ao fazer logout', error);
		}
	};

	useEffect(() => {
		if(user) {
			setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
		}
		return () => {};
	}, [user]);
	return (
		<div className=''>
			<div className=''>
				<div className=''>
					<img src='' alt='' className='' />
				</div>

				{user?.role === 'admin' && ( <div className=''>Admin</div>)}

				<h5 className=''>{user?.name || ''}</h5>

				<p className=''>{user?.email || ''}</p>
			</div>

			{sideMenuData.map((item, index) => (
                <button key={`menu_${index}`} className={`w-full flex items-center gap-4 text-[15px] ${activeMenu == item.label ? 'text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3' : ''} py-3 px-6 mb-3 cursor-pointer`}
				onClick={() => handleClick(item.path)}
				>
					<item.icon className='' />
					{item.label}
				</button>
			))}
		</div>
	);
};

export default SideMenu;
