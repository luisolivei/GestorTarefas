const createDOMPurify = require('isomorphic-dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Função recursiva para limpar qualquer estrutura: string, array ou objeto
function deepSanitize(value) {
	if (typeof value === 'string') {
		return DOMPurify.sanitize(value);
	}

	if (Array.isArray(value)) {
		return value.map(item => deepSanitize(item));
	}

	if (typeof value === 'object' && value !== null) {
		const sanitizedObj = {};
		for (const key in value) {
			sanitizedObj[key] = deepSanitize(value[key]);
		}
		return sanitizedObj;
	}

	// Se não for string, array nem objeto (ex: number, boolean), devolve como está
	return value;
}

function sanitizeInputs(req, res, next) {
	if (req.body && typeof req.body === 'object') {
		req.body = deepSanitize(req.body);
	}
	next();
}

module.exports = sanitizeInputs;
