import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUsers } from 'react-icons/lu';
import Modal from '../Modal';
import AvatarGroup from '../AvatarGroup';


// Componente para selecionar utilizadores e atribuí-los a algo (ex.: tarefa, projeto)
// Props:
//   - selectedUsers    → array de IDs de utilizadores já selecionados
//   - setSelectedUsers → função para atualizar os utilizadores selecionados
const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
	const [allUsers, setAllUsers] = useState([]); // lista de todos os utilizadores
	const [isModalOpen, setIsModalOpen] = useState(false); // controla se o modal está aberto
	const [tempSelectedUsers, setTempSelectedUsers] = useState([]); // seleção temporária dentro do modal

	// Função para buscar todos os utilizadores da API
	const getAllUsers = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
			if (response.data?.length > 0) {
				setAllUsers(response.data);
			}
		} catch (error) {
			console.error('Error fetching users:', error);
		}
	};

	// Alterna a seleção de um utilizador na lista temporária
	const toggleUserSelection = userId => {
		setTempSelectedUsers(prev => (prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]));
	};
	// Confirma a seleção e atualiza os utilizadores selecionados
	const handleAssign = () => {
		setSelectedUsers(tempSelectedUsers);
		setIsModalOpen(false);
	};
	// Lista de URLs de avatar dos utilizadores selecionados
	const selectedUserAvatars = allUsers.filter(user => selectedUsers.includes(user._id)).map(user => user.profileImageUrl);

	// Busca todos os utilizadores ao montar o componente
	useEffect(() => {
		getAllUsers();
	}, []);

	// Se não houver utilizadores selecionados, limpa a seleção temporária
	useEffect(() => {
		if (selectedUsers.length === 0) {
			setTempSelectedUsers([]);
		}
		return () => {};
	}, [selectedUsers]);

	return (
		<div className='space-y-4 mt-2'>
			{/* Botão para abrir o modal caso não haja utilizadores selecionados */}
			{selectedUserAvatars.length === 0 && (
				<button className='card-btn' onClick={() => setIsModalOpen(true)}>
					<LuUsers className='text-sm' /> Adicionar Membros
				</button>
			)}

			{/* Mostra avatars dos utilizadores selecionados, clicáveis para abrir o modal */}
			{selectedUserAvatars.length > 0 && (
				<div className='cursor-pointer' onClick={() => setIsModalOpen(true)}>
					<AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
				</div>
			)}

			{/* Modal para selecionar utilizadores */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Select Users'>
				<div className='space-y-4 h-[60vh] overflow-y-auto'>
					{/* Lista de todos os utilizadores */}
					{allUsers.map(user => (
						<div key={user._id} className='flex items-center gap-4 p-3 border-b border-gray-200'>
							{/* Avatar do utilizador */}
							{user.profileImageUrl ? (
								<img src={user.profileImageUrl} alt={user.name} className='w-10 h-10 rounded-full' />
							) : (
								<div className='w-10 h-10 rounded-full bg-gray-200 border border-gray-300' />
							)}
							{/* Nome e email */}
							<div className='flex-1'>
								<p className='font-medium text-gray-800 dark:text-white'>{user.name}</p>
								<p className='text-[13px] text-gray-500'>{user.email}</p>
							</div>
							{/* Checkbox para selecionar ou desselecionar */}
							<input
								type='checkbox'
								checked={tempSelectedUsers.includes(user._id)}
								onChange={() => toggleUserSelection(user._id)}
								className='w-4 h-4 accent-primary bg-gray-100 border-gray-300 rounded-sm outline-none'
							/>
						</div>
					))}
				</div>

				{/* Botões de ação no modal */}
				<div className='flex justify-end gap-4 pt-4'>
					<button className='card-btn' onClick={() => setIsModalOpen(false)}>
						Cancelar
					</button>
					<button className='card-btn-fill' onClick={handleAssign}>
						Concluir
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default SelectUsers;
