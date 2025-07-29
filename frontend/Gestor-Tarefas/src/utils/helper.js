// Função para validar se um email tem um formato válido
export const validateEmail = email => {
	// Expressão regular que verifica se o email tem um formato correto
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// Retorna true se o email corresponder à expressão regular, caso contrário false
	return regex.test(email);
};
