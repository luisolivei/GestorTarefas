import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const PrivateRoute = ({ allowedRoles }) => {
	const [isAuthorized, setIsAuthorized] = useState(null); // null = loading

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
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
