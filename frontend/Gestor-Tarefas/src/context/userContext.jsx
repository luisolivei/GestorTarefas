import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import UserContext from './userContext';

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				// Com cookies HttpOnly, não precisas verificar localStorage
				const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
					withCredentials: true, // garante envio de cookies
				});
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching user:', error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const updateUser = updatedUser => {
		setUser(updatedUser);
		
	};

	const clearUser = () => {
		setUser(null);
		
	};

	return <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
