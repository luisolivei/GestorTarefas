import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
const Input = ({ value, onChange, label, placeholder, type }) => {
	// Estado para controlar se a password está visível ou não
	const [showPassword, setShowPassword] = useState(false);

	// Função para alternar a visibilidade da password
	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div>
			{/* Rótulo do campo */}
			<label className='text-[13px] text-slate-800'>{label}</label>

			<div className='input-box'>
				{/* Campo de input com tipo condicionado pela visibilidade da password */}
				<input
					type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
					placeholder={placeholder}
					className='w-full bg-transparent outline-none'
					value={value}
					onChange={e => onChange(e)} // Chamada da função de alteração passada como prop
				/>

				{/* Se o tipo for 'password', mostra o ícone para alternar visibilidade */}
				{type === 'password' && (
					<>
						{showPassword ? (
							// Ícone para ocultar password
							<FaRegEye size={22} className='text-primary cursor-pointer' onClick={toggleShowPassword} />
						) : (
							// Ícone para mostrar password
							<FaRegEyeSlash size={22} className='text-slate-400 cursor-pointer' onClick={toggleShowPassword} />
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Input;
