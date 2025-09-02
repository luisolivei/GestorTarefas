import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import AuthLayout from '../../components/layouts/AuthLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths'; // Certifique-se de que o caminho está correto
import { UserContext } from '../../context/UserContext';

const Login = () => {
	// Estado para armazenar o email inserido pelo utilizador
	const [email, setEmail] = useState('');
	// Estado para armazenar a palavra-passe inserida
	const [password, setPassword] = useState('');
	// Estado para mensagens de erro
	const [error, setError] = useState(null);

	const { updateUser } = useContext(UserContext);

	// Hook para navegar programaticamente entre rotas
	const navigate = useNavigate();

	// Função para processar o envio do formulário de login
	const handleLogin = async e => {
		e.preventDefault();

		// Valida o email
		if (!validateEmail(email)) {
			setError('Por favor, insira um email válido.');
			return;
		}

		// Valida a password
		if (!password) {
			setError('Por favor, insira uma senha.');
			return;
		}

		setError('');

		try {
			// Efetuar login — cookie HttpOnly definido automaticamente
			const loginResponse = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });

			// Obter dados do utilizador diretamente da API de login
			let userData = loginResponse.data?.user;

			// Se não retornar, buscar perfil do utilizador
			if (!userData) {
				const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
				userData = profileResponse.data;
			}

			// Atualiza o estado global com os dados do utilizador
			updateUser(userData);

			// Redireciona consoante o role do utilizador
			if (userData.role === 'admin') {
				navigate('/admin/dashboard');
			} else {
				navigate('/user/dashboard');
			}
		} catch (error) {
			// Mensagem de erro específica da API ou genérica
			if (error.response?.data?.message) {
				setError(error.response.data.message);
			} else {
				setError('Ocorreu um erro ao efetuar o login. Por favor, tente novamente.');
			}
		}
	};

	return (
		<AuthLayout>
			<div className='w-full max-w-md mx-auto bg-white/60 p-6 rounded-lg shadow-md'>
				<h3 className='text-center text-xl font-semibold text-slate-800'>Bem-vindo</h3>
				<p className='text-s text-slate-700 mt-[5px]  mb-[10px]'>Insere os dados para efetuar o login</p>

				<form onSubmit={handleLogin}>
					{/* Campo de email */}
					<Input value={email} onChange={({ target }) => setEmail(target.value)} label='Email' placeholder='john@example.com' type='text' />

					{/* Campo de palavra-passe */}
					<Input value={password} onChange={({ target }) => setPassword(target.value)} label='Palavra-passe' placeholder='Mínimo 6 caracteres' type='password' />

					{/* Mensagem de erro, se existir */}
					{error && <p className='text-red-500 text-sm pb-2.5'>{error}</p>}

					{/* Botão de submissão do formulário */}
					<button type='submit' className='btn-primary'>
						Login
					</button>

					{/* Link para página de registo */}
					<p className='text-[13px] text-slate-800 mt-3'>
						Não tens conta?{' '}
						<Link className='font-semibold text-[13px] text-primary underline' to='/signup'>
							Regista-te
						</Link>
					</p>
				</form>
			</div>
		</AuthLayout>
	);
};

export default Login;