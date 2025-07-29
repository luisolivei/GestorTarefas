import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';

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
	};

	return (
		<div className='w-full h-3/4 md:h-full flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-8'>
			<h3 className='text-xl font-semibold text-black'>Bem-vindo</h3>
			<p className='text-s text-slate-700 mt-[5px] mb-[10px]'>Insere os dados para efetuar o login</p>

			<form onSubmit={handleLogin}>
				{/* Campo de email */}
				<Input value={email} onChange={({ target }) => setEmail(target.value)} label='Email' placeholder='john@example.com' type='text' />

				{/* Campo de password */}
				<Input value={password} onChange={({ target }) => setPassword(target.value)} label='Password' placeholder='Mínimo 6 caracteres' type='password' />

				{/* Mensagem de erro, se existir */}
				{error && <p className='text-red-500 text-sm pb-2.5'>{error}</p>}

				{/* Botão de submissão do formulário */}
				<button type='submit' className='btn-primary'>
					Login
				</button>

				{/* Link para a página de registo */}
				<p className='text-[13px] text-slate-800 mt-3'>
					Não tens conta?{' '}
					<Link className='font-medium text-primary underline' to='/signup'>
						Regista-te
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Login;
