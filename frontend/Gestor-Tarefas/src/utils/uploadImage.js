import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';

const uploadImage = async imageFile => {
	if (!imageFile) return { imageUrl: '' }; // Se não houver imagem, devolve vazio

	const formData = new FormData();
	formData.append('image', imageFile);

	try {
		const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data || { imageUrl: '' }; // Garantir que devolve sempre um objeto
	} catch (error) {
		console.error('Erro a fazer upload da imagem:', error);
		// Retorna vazio em vez de lançar erro, para não bloquear o registo
		return { imageUrl: '' };
	}
};

export default uploadImage;
