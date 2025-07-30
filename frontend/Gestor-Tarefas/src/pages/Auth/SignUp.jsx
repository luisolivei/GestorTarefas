import { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { Link } from 'react-router-dom';

const SignUp = () => {
	const [profilePicture, setProfilePicture] = useState(null);
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [adminInviteToken, setAdminInviteToken] = useState('');

	const [error, setError] = useState(null);

	const handleSignUp = async e => {
		e.preventDefault(); // Evita o comportamento padrão de recarregar a página ao submeter o formulário

		// Valida o nome completo; se estiver vazio, define a mensagem de erro
		if (!fullName) {
			setError('Por favor, insira o seu nome.');
			return;
		}

		// Valida o email; se for inválido, define a mensagem de erro
		if (!validateEmail(email)) {
			setError('Por favor, insira o seu email.');
			return;
		}

		// Verifica se a palavra-passe foi inserida
		if (!password) {
			setError('Por favor, insira a sua palavra-passe.');
			return;
		}

		// Limpa qualquer erro anterior
		setError('');

		// Aqui podes adicionar a lógica para registar o utilizador (ex: chamada à API)
	};
	return (
		<AuthLayout>
			<div className='w-full max-w-md mx-auto bg-white/60 p-6 rounded-lg shadow-md'>
				<h3 className='text-center text-xl font-semibold text-slate-800 mb-6'>Preencha os campos para criar conta</h3>

				<form onSubmit={handleSignUp}>
					<ProfilePhotoSelector image={profilePicture} setImage={setProfilePicture} />

					<div>
						<Input value={fullName} onChange={({ target }) => setFullName(target.value)} label='Nome completo' placeholder='Insira o seu nome completo' type='text' />

						{/* Campo de email */}
						<Input value={email} onChange={({ target }) => setEmail(target.value)} label='Email' placeholder='john@example.com' type='text' />

						{/* Campo da palavra-passe */}
						<Input value={password} onChange={({ target }) => setPassword(target.value)} label='Palavra-passe' placeholder='Mínimo 6 caracteres' type='password' />

						{/* Campo do token de convite de administrador */}
						<Input value={adminInviteToken} onChange={({ target }) => setAdminInviteToken(target.value)} label='Token de Convite de Administrador' placeholder='Digite' type='text' />
					</div>

					{/* Mensagem de erro */}
					{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

					{/* Botão de submissão do formulário */}
					<button type='submit' className='btn-primary'>
						Registar
					</button>

					{/* Link para a página de login */}
					<p className='text-[13px] text-slate-800 mt-3'>
						Já tem uma conta?{' '}
						<Link className='font-semibold text-[13px] text-primary underline' to='/login'>
							Login
						</Link>
					</p>
				</form>
			</div>
		</AuthLayout>
	);
};

export default SignUp;
