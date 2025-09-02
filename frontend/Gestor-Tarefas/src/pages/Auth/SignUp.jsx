import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext'; // Contexto do utilizador
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
	// Estados do formulário
	const [profilePicture, setProfilePicture] = useState(null); // Foto de perfil
	const [fullName, setFullName] = useState(''); // Nome completo
	const [email, setEmail] = useState(''); // Email
	const [password, setPassword] = useState(''); // Palavra-passe
	const [adminInviteToken, setAdminInviteToken] = useState(''); // Token de convite de admin

	const [error, setError] = useState(null); // Mensagem de erro
	const [success, setSuccess] = useState(false); // Estado de sucesso

	const { updateUser } = useContext(UserContext); // Pega a função updateUser do contexto
	const navigate = useNavigate(); // Hook para navegação

	// Função para processar o registo
	const handleSignUp = async e => {
		e.preventDefault();

		// Valida campos
		if (!fullName) return setError('Por favor, insira o seu nome.');
		if (!validateEmail(email)) return setError('Por favor, insira um email válido.');
		if (!password) return setError('Por favor, insira a sua palavra-passe.');

		setError('');
		setSuccess(false);

		try {
			// Faz upload da imagem de perfil (se houver)
			const { imageUrl: profileImageUrl } = await uploadImage(profilePicture);

			// Requisição de registo — cookie HttpOnly definido no backend
			const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
				name: fullName,
				email,
				password,
				profileImageUrl,
				adminInviteToken,
			});

			// Atualiza o estado global do utilizador (se a API retornar o user)
			if (response.data?.user) {
				updateUser(response.data.user);
			}

			// Indica sucesso
			setSuccess(true);

			// Limpa campos do formulário
			setFullName('');
			setEmail('');
			setPassword('');
			setAdminInviteToken('');
			setProfilePicture(null);

			// Redireciona para a página de login após 2 segundos
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} catch (error) {
			// Mensagem de erro da API ou genérica
			if (error.response?.data?.message) {
				setError(error.response.data.message);
			} else {
				setError('Ocorreu um erro ao efetuar o registo. Por favor, tente novamente.');
			}
		}
	};

	return (
		<AuthLayout>
			<div className='w-full max-w-md mx-auto bg-white/60 p-6 rounded-lg shadow-md'>
				<h3 className='text-center text-xl font-semibold text-slate-800 mb-6'>Preencha os campos para criar conta</h3>

				<form onSubmit={handleSignUp}>
					{/* Seletor de foto de perfil */}
					<ProfilePhotoSelector image={profilePicture} setImage={setProfilePicture} />

					<div>
						{/* Campos do formulário */}
						<Input value={fullName} onChange={({ target }) => setFullName(target.value)} label='Nome completo' placeholder='Insira o seu nome completo' type='text' />
						<Input value={email} onChange={({ target }) => setEmail(target.value)} label='Email' placeholder='john@example.com' type='text' />
						<Input value={password} onChange={({ target }) => setPassword(target.value)} label='Palavra-passe' placeholder='Mínimo 6 caracteres' type='password' />
						<Input value={adminInviteToken} onChange={({ target }) => setAdminInviteToken(target.value)} label='Token de Convite de Administrador' placeholder='Digite' type='text' />
					</div>

					{/* Mensagens de erro ou sucesso */}
					{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
					{success && <p className='text-green-700 text-sm mt-2'>Conta criada com sucesso! A redirecionar para login...</p>}

					{/* Botão de submissão */}
					<button type='submit' className='btn-primary mt-4'>
						Registar
					</button>

					{/* Link para login */}
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
