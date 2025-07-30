import { useState, useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
	const inputRef = useRef(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	// Lida com a seleção de uma nova imagem
	const handleImageChange = event => {
		const file = event.target.files[0];
		if (file) {
			setImage(file);

			// Gera uma pré-visualização da imagem selecionada
			const preview = URL.createObjectURL(file);
			setPreviewUrl(preview);
		}
	};

	// Remove a imagem selecionada
	const handleRemoveImage = () => {
		setImage(null);
		setPreviewUrl(null);
	};

	// Abre o seletor de ficheiros
	const onChooseFile = () => {
		inputRef.current.click();
	};

	return (
		<div className='flex flex-col items-center mb-6'>
			{/* Input de ficheiro oculto para seleção de imagem */}
			<input type='file' accept='image/*' ref={inputRef} onChange={handleImageChange} className='hidden' />

			{/* Se não houver imagem, mostra o ícone de utilizador e botão para carregar */}
			{!image ? (
				<div className='w-20 h-20 flex items-center justify-center bg-slate-200 rounded-full relative cursor-pointer'>
					<LuUser className='text-4xl text-primary' />

					{/* Botão para escolher ficheiro */}
					<button type='button' className='w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full absolute bottom-1 right-1 cursor-pointer' onClick={onChooseFile}>
						<LuUpload />
					</button>
				</div>
			) : (
				// Se houver imagem, mostra a pré-visualização e botão para remover
				<div className='relative'>
					<img src={previewUrl} alt='profile photo' className='w-20 h-20 object-cover rounded-full' />
					<button type='button' className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1' onClick={handleRemoveImage}>
						<LuTrash />
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfilePhotoSelector;
