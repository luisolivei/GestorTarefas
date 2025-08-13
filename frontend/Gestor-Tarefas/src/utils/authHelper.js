// Função para limpar o contexto quando der 401
let clearUserFunction = null;

export const registerClearUser = fn => {
	clearUserFunction = fn;
};

export const clearUserOn401 = () => {
	if (clearUserFunction) {
		clearUserFunction();
	}
};
