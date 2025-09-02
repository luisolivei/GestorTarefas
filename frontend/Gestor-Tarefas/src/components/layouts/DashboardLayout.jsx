import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

// Componente de layout principal do dashboard
// Props:
//   - children   → conteúdo interno (páginas do dashboard)
//   - activeMenu → indica o menu ativo para Navbar e SideMenu
const DashboardLayout = ({ children, activeMenu }) => {
	const { user } = useContext(UserContext); // acede ao utilizador autenticado

	return (
		<div className=''>
			{/* Barra de navegação no topo */}
			<Navbar activeMenu={activeMenu} />

			{/* Conteúdo principal visível apenas se houver utilizador autenticado */}
			{user && (
				<div className='flex'>
					{/* Menu lateral, oculto em ecrãs menores que 1080px */}
					<div className='max-[1080px]:hidden'>
						<SideMenu activeMenu={activeMenu} />
					</div>

					{/* Área principal onde o conteúdo do dashboard é renderizado */}
					<div className='grow mx-5'>{children}</div>
				</div>
			)}
		</div>
	);
};

export default DashboardLayout;