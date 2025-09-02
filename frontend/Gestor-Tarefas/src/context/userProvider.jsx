import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { registerClearUser } from '../utils/authHelper';
import { UserContext } from './UserContext'; // contexto do utilizador

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null); // estado do utilizador
	const [loading, setLoading] = useState(true); // estado de carregamento

	// Função para limpar o utilizador (ex.: logout)
	const clearUser = () => {
		setUser(null);
		setLoading(false);
	};

	useEffect(() => {
		// Regista a função clearUser globalmente
		registerClearUser(clearUser);

		let isMounted = true; // variável para verificar se o componente está montado

		const fetchUser = async () => {
			try {
				// Obter dados do perfil do utilizador
				const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
				if (isMounted) setUser(response.data);
			} catch {
				// Em caso de erro, limpar o utilizador
				if (isMounted) setUser(null);
			} finally {
				// Atualizar estado de carregamento
				if (isMounted) setLoading(false);
			}
		};

		fetchUser();

		// Cleanup: indica que o componente deixou de estar montado
		return () => {
			isMounted = false;
		};
	}, []);

	// Função para atualizar o estado do utilizador
	const updateUser = updatedUser => {
		setUser(updatedUser);
		setLoading(false);
	};

	// Fornece o contexto com utilizador, estado de loading e funções de atualização/limpeza
	return <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
