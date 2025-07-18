const mongoose = require('mongoose');
// Definir o esquema do usuário
const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profileImageUrl: { type: String, default: '' },
		role: { type: String, enum: ['admin', 'member'], default: 'member' }, // Definindo o papel do usuário
	},
	{ timestamps: true },
);
// Criar o modelo do usuário
module.exports = mongoose.model('User', UserSchema);
