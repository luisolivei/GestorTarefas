import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';

import Dashboard from './pages/Admin/Dashboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PrivateRoute from './routes/PrivateRoute';

import UserProvider, { UserContext } from './context/userContext';

const App = () => {
	return (
		<Router>
			<UserProvider>
				<Routes>
					{/* Auth Routes */}
					<Route path='/login' element={<Login />} />
					<Route path='/signUp' element={<SignUp />} />

					{/* Admin Routes */}
					<Route element={<PrivateRoute allowedRoles={['admin']} />}>
						<Route path='/admin/dashboard' element={<Dashboard />} />
						<Route path='/admin/tasks' element={<ManageTasks />} />
						<Route path='/admin/create-task' element={<CreateTask />} />
						<Route path='/admin/users' element={<ManageUsers />} />
					</Route>

					{/* User Routes */}
					<Route element={<PrivateRoute allowedRoles={['member']} />}>
						<Route path='/user/dashboard' element={<UserDashboard />} />
						<Route path='/user/tasks' element={<MyTasks />} />
						<Route path='/user/tasks-details/:id' element={<ViewTaskDetails />} />
					</Route>

					{/* Default Redirect */}
					<Route path='/*' element={<RootRedirect />} />
				</Routes>
			</UserProvider>
		</Router>
	);
};

export default App;

const RootRedirect = () => {
	const { user, loading } = useContext(UserContext);

	if (loading) {
		return <p>A carregar...</p>; // Aqui podes meter um spinner
	}

	if (!user) {
		return <Navigate to='/login' replace />;
	}

	return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
};
