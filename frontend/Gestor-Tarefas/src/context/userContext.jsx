import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';


export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
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

	const clearUser = () => {
		setUser(null);
		setLoading(false);
	};

	return <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
