// Componente de layout para páginas de autenticação (login/registo)
// Props:
//   - children → conteúdo interno (ex.: formulário de login ou registo)
const AuthLayout = ({ children }) => {
	return (
		// Contêiner principal com imagem de fundo
		<div className='min-h-screen w-full bg-no-repeat bg-center bg-fixed bg-cover' style={{ backgroundImage: "url('/auth_bg.jpg')" }}>
			{/* Sobreposição com efeito blur e fundo semi-transparente */}
			<div className='flex flex-col items-center justify-center min-h-screen w-full backdrop-blur-lg  bg-white/30 px-4'>
				{/* Título centrado no topo */}
				<h2 className='text-3xl text-slate-600 font-bold mb-6'>Gestor de Tarefas</h2>

				{/* Conteúdo filho (formulário de login ou registo) */}
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;
