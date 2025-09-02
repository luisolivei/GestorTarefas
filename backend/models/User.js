const mongoose = require('mongoose');

// Definir o esquema do utilizador
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true, // O nome é obrigatório
		},
		email: {
			type: String,
			required: true, // O email é obrigatório
			unique: true, // Cada email deve ser único
		},
		password: {
			type: String,
			required: true, // A password é obrigatória
		},
		profileImageUrl: {
			type: String,
			default: '', // URL da imagem de perfil, vazio por defeito
		},
		role: {
			type: String,
			enum: ['admin', 'member'], // Apenas valores permitidos
			default: 'member', // Papel por defeito: membro
		},
	},
	{ timestamps: true }, // Adiciona automaticamente campos createdAt e updatedAt
);

// Criar o modelo do utilizador com base no esquema
module.exports = mongoose.model('User', UserSchema);
