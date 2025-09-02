import { useState } from 'react';
import SideMenu from './SideMenu';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

// Componente Navbar do dashboard
// Props:
//   - activeMenu → indica qual o menu ativo (para destacar a opção correta)
const Navbar = ({ activeMenu }) => {
	const [openSideMenu, setOpenSideMenu] = useState(false); // controla a abertura do menu lateral em ecrãs pequenos

	return (
		<div className='flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] px-7 py-4 sticky top-0 z-30'>
			{/* Botão de menu hamburger para ecrãs pequenos */}
			<button className='block lg:hidden text-black' onClick={() => setOpenSideMenu(!openSideMenu)}>
				{
					openSideMenu ? (
						<HiOutlineX className='text-2xl' /> // Ícone "X" para fechar o menu
					) : (
						<HiOutlineMenu className='text-2xl' />
					) // Ícone hamburger para abrir o menu
				}
			</button>

			{/* Título do sistema */}
			<h2 className='text-lg font-medium text-black'>Gestor de Tarefas</h2>

			{/* Menu lateral visível apenas quando openSideMenu é true */}
			{openSideMenu && (
				<div className='fixed top-[61px] -ml-4 bg-white'>
					<SideMenu activeMenu={activeMenu} />
				</div>
			)}
		</div>
	);
};

export default Navbar;
