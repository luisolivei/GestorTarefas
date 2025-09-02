// Importa o StrictMode do React para detectar problemas durante o desenvolvimento
import { StrictMode } from 'react';

// Importa a função createRoot do React 18 para renderizar a aplicação
import { createRoot } from 'react-dom/client';

// Importa os estilos globais da aplicação
import './index.css';

// Importa o componente principal da aplicação
import App from './App.jsx';

// Seleciona o elemento root no HTML e cria a raiz da aplicação React
createRoot(document.getElementById('root')).render(
	<StrictMode>
		{/* Renderiza o componente principal dentro do StrictMode */}
		<App />
	</StrictMode>,
);
