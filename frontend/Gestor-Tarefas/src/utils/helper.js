// Função para validar se um email tem um formato válido
export const validateEmail = email => {
	// Expressão regular que verifica se o email possui o formato correto (ex.: exemplo@dominio.com)
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// Retorna true se o email corresponder à expressão regular, caso contrário retorna false
	return regex.test(email);
};

// Função para adicionar separadores de milhar a um número
export const addThousandsSeparator = num => {
	// Verifica se o valor é nulo ou não é um número
	if (num == null || isNaN(num)) return '';

	// Separa a parte inteira e a parte decimal (se existir)
	const [integerPart, fractionalPart] = num.toString().split('.');

	// Adiciona o separador de milhar (.) à parte inteira
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

	// Junta a parte inteira formatada com a parte decimal (usando vírgula como separador decimal)
	return fractionalPart ? `${formattedInteger},${fractionalPart}` : formattedInteger;
};
