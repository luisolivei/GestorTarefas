import { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
	const [profilePicture, setProfilePicture] = useState(null);
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [adminInviteToken, setAdminInviteToken] = useState('');

	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false); // Estado para sucesso

	const { updateUser } = useContext(UserContext);
	const navigate = useNavigate();

	const handleSignUp = async e => {
		e.preventDefault();

		if (!fullName) return setError('Por favor, insira o seu nome.');
		if (!validateEmail(email)) return setError('Por favor, insira um email válido.');
		if (!password) return setError('Por favor, insira a sua palavra-passe.');

		setError('');
		setSuccess(false);

		try {
			const { imageUrl: profileImageUrl } = await uploadImage(profilePicture);

			// Requisição de registo — cookie HttpOnly será definido no backend
			await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
				name: fullName,
				email,
				password,
				profileImageUrl,
				adminInviteToken,
			});

			// Indica sucesso
			setSuccess(true);

			// Limpar campos (opcional)
			setFullName('');
			setEmail('');
			setPassword('');
			setAdminInviteToken('');
			setProfilePicture(null);

			// Redireciona após 2 segundos para o login
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} catch (error) {
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
					<ProfilePhotoSelector image={profilePicture} setImage={setProfilePicture} />

					<div>
						<Input value={fullName} onChange={({ target }) => setFullName(target.value)} label='Nome completo' placeholder='Insira o seu nome completo' type='text' />

						<Input value={email} onChange={({ target }) => setEmail(target.value)} label='Email' placeholder='john@example.com' type='text' />

						<Input value={password} onChange={({ target }) => setPassword(target.value)} label='Palavra-passe' placeholder='Mínimo 6 caracteres' type='password' />

						<Input value={adminInviteToken} onChange={({ target }) => setAdminInviteToken(target.value)} label='Token de Convite de Administrador' placeholder='Digite' type='text' />
					</div>

					{/* Mensagens de erro ou sucesso */}
					{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
					{success && <p className='text-green-700 text-sm mt-2'>Conta criada com sucesso! A redirecionar para login...</p>}

					<button type='submit' className='btn-primary mt-4'>
						Registar
					</button>

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
