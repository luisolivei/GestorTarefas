import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

// Componente para proteger rotas privadas com base no role do utilizador
const PrivateRoute = ({ allowedRoles }) => {
	// Obtém o utilizador e o estado de carregamento do contexto global
	const { user, loading } = useContext(UserContext);

	// Se ainda estiver a verificar a autenticação, mostra uma mensagem de loading
	if (loading) return <p>A verificar autenticação...</p>;

	// Se não houver utilizador autenticado, redireciona para a página de login
	if (!user) return <Navigate to='/login' replace />;

	// Se o utilizador não tiver o role permitido, também redireciona para login
	if (!allowedRoles.includes(user.role)) return <Navigate to='/login' replace />;

	// Se passar todas as verificações, renderiza o conteúdo protegido
	return <Outlet />;
};

export default PrivateRoute;
