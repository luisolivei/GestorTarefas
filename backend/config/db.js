const mongoose = require('mongoose');

// Função para conectar à base de dados MongoDB
const connectDB = async () => {
	try {
		// Tenta estabelecer ligação com o MongoDB usando a URI do ficheiro .env
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true, // Permite usar o novo parser de URLs do MongoDB
			useUnifiedTopology: true, // Utiliza a nova engine de topologia unificada
		});

		// Confirmação de conexão bem-sucedida
		console.log('MongoDB conectado com sucesso!');
	} catch (err) {
		// Caso ocorra um erro, mostrar mensagem e terminar aplicação
		console.error('Erro ao conectar ao MongoDB:', err.message);
		process.exit(1);
	}
};

// Exporta a função para ser utilizada noutros ficheiros
module.exports = connectDB;
