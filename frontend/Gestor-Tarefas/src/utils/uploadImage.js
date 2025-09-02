import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';

// Função para fazer upload de uma imagem
const uploadImage = async imageFile => {
	// Se não houver imagem, devolve um objeto com imageUrl vazio
	if (!imageFile) return { imageUrl: '' };

	// Cria um FormData para enviar o ficheiro via multipart/form-data
	const formData = new FormData();
	formData.append('image', imageFile);

	try {
		// Requisição POST para fazer upload da imagem
		const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
			headers: {
				'Content-Type': 'multipart/form-data', // Importante para ficheiros
			},
		});

		// Retorna os dados da resposta ou um objeto com imageUrl vazio
		return response.data || { imageUrl: '' };
	} catch (error) {
		console.error('Erro a fazer upload da imagem:', error);
		// Retorna vazio em vez de lançar erro, para não impedir o registo do utilizador
		return { imageUrl: '' };
	}
};

export default uploadImage;
