import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { registerClearUser } from '../utils/authHelper';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const clearUser = () => {
		setUser(null);
		setLoading(false);
	};

	useEffect(() => {
		// Regista a função para que o axiosInstance possa limpá-la no 401
		registerClearUser(clearUser);

		let isMounted = true;
		const fetchUser = async () => {
			try {
				const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
				if (isMounted) setUser(response.data);
			} catch {
				if (isMounted) setUser(null);
			} finally {
				if (isMounted) setLoading(false);
			}
		};
		fetchUser();

		return () => {
			isMounted = false;
		};
	}, []);

	const updateUser = updatedUser => {
		setUser(updatedUser);
		setLoading(false);
	};

	return <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
