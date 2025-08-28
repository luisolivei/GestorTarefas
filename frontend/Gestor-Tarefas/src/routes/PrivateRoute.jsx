import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ allowedRoles }) => {
	const { user, loading } = useContext(UserContext);

	if (loading) return <p>A verificar autenticação...</p>;
	if (!user) return <Navigate to='/login' replace />;
	if (!allowedRoles.includes(user.role)) return <Navigate to='/login' replace />;

	return <Outlet />;
};

export default PrivateRoute;
