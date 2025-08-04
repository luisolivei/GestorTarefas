import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import AuthLayout from '../../components/layouts/AuthLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths'; // Certifique-se de que o caminho está correto

const Login = () => {
	// Estado para armazenar o email inserido pelo utilizador
	const [email, setEmail] = useState('');
	// Estado para armazenar a password inserida
	const [password, setPassword] = useState('');
	// Estado para armazenar mensagens de erro
	const [error, setError] = useState(null);

	// Hook para navegar programaticamente entre rotas
	const navigate = useNavigate();

	// Função para lidar com o envio do formulário de login
	const handleLogin = async e => {
		e.preventDefault(); // Evita o comportamento padrão de recarregar a página ao submeter o formulário

		// Valida o email; se for inválido, define a mensagem de erro
		if (!validateEmail(email)) {
			setError('Por favor, insira um email válido.');
			return;
		}

		// Verifica se a password foi inserida
		if (!password) {
			setError('Por favor, insira uma senha.');
			return;
		}

		// Limpa qualquer erro anterior
		setError('');

		// Aqui podes adicionar a lógica para autenticar o utilizador (ex: chamada à API)
		try {
			const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,
				{ email, password, });

			const { token, role } = response.data;
			
			if(token) {
				localStorage.setItem('token', token);

				// Redireciona consoante o papel do usuário
				if (role === 'admin') {
					navigate('/admin/dashboard-data');
				} else {
					navigate('/user/user-dashboard-data');
				}
			}
		} catch (error) {
			if (error.response && error.response.data.message) {
				setError(error.response.data.message);
			}else {
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

					{/* Campo de password */}
					<Input value={password} onChange={({ target }) => setPassword(target.value)} label='Palavra-passe' placeholder='Mínimo 6 caracteres' type='password' />

					{/* Mensagem de erro, se existir */}
					{error && <p className='text-red-500 text-sm pb-2.5'>{error}</p>}

					{/* Botão de submissão do formulário */}
					<button type='submit' className='btn-primary'>
						Login
					</button>

					{/* Link para a página de registo */}
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
