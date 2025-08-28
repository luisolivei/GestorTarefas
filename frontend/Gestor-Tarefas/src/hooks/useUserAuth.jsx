import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export const useUserAuth = () => {
	const { user, loading, clearUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (loading) return; // espera carregar user
		if (user) return; // user já existe

		clearUser(); // limpa user caso não exista
		navigate('/login'); // redireciona para login
	}, [user, loading, clearUser, navigate]);

	return { user, loading };
};
