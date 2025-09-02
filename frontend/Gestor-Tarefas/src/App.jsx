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

import UserProvider from './context/UserProvider'; // Provider do utilizador (estado global)
import { UserContext } from './context/UserContext'; // Contexto do utilizador
import { Toaster } from 'react-hot-toast';

const App = () => {
	return (
		<Router>
			{/* Envolve toda a app com o UserProvider para disponibilizar o estado global */}
			<UserProvider>
				<Routes>
					{/* Rotas de autenticação */}
					<Route path='/login' element={<Login />} />
					<Route path='/signUp' element={<SignUp />} />

					{/* Rotas de administrador - acessíveis apenas a utilizadores com role 'admin' */}
					<Route element={<PrivateRoute allowedRoles={['admin']} />}>
						<Route path='/admin/dashboard' element={<Dashboard />} />
						<Route path='/admin/tasks' element={<ManageTasks />} />
						<Route path='/admin/create-task' element={<CreateTask />} />
						<Route path='/admin/users' element={<ManageUsers />} />
					</Route>

					{/* Rotas de membro - acessíveis apenas a utilizadores com role 'member' */}
					<Route element={<PrivateRoute allowedRoles={['member']} />}>
						<Route path='/user/dashboard' element={<UserDashboard />} />
						<Route path='/user/create-task' element={<CreateTask />} />
						<Route path='/user/tasks' element={<MyTasks />} />
						<Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
					</Route>

					{/* Redirecionamento padrão */}
					<Route path='/*' element={<RootRedirect />} />
				</Routes>

				{/* Componente para notificações/toasts */}
				<Toaster
					toastOptions={{
						className: 'bg-gray-800 text-white',
						style: { fontSize: '13px' },
					}}
				/>
			</UserProvider>
		</Router>
	);
};

export default App;

// Componente para redirecionamento baseado no estado do utilizador
const RootRedirect = () => {
	const { user, loading } = useContext(UserContext);

	if (loading) return <p>A carregar...</p>; // Mostra enquanto carrega os dados do utilizador
	if (!user) return <Navigate to='/login' replace />; // Se não houver utilizador, redireciona para login

	// Redireciona com base no role do utilizador
	return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
};
