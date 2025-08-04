import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const PrivateRoute = ({ allowedRoles }) => {
	const [isAuthorized, setIsAuthorized] = useState(null); // null = loading

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axiosInstance.get('/api/auth/profile');
				const userRole = res.data.role;
				setIsAuthorized(allowedRoles.includes(userRole));
			} catch {
				setIsAuthorized(false);
			}
		};

		checkAuth();
	}, [allowedRoles]);

	if (isAuthorized === null) return <p>A verificar autenticação...</p>;
	if (!isAuthorized) return <Navigate to='/login' replace />;
	return <Outlet />;
};

export default PrivateRoute;
