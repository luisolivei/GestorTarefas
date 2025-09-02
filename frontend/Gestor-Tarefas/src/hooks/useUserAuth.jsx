import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Hook personalizado para autenticação de utilizador
export const useUserAuth = () => {
	const { user, loading, clearUser } = useContext(UserContext); // acede ao contexto do utilizador
	const navigate = useNavigate(); // hook para navegação

	useEffect(() => {
		if (loading) return; // espera até o estado de loading terminar
		if (user) return; // se já existe um utilizador, não faz nada

		clearUser(); // limpa o estado do utilizador caso não exista
		navigate('/login'); // redireciona para a página de login
	}, [user, loading, clearUser, navigate]);

	// Retorna o utilizador e estado de loading
	return { user, loading };
};
