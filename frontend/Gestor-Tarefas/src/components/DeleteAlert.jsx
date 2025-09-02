// Componente de alerta para confirmação de eliminação
// Props:
//   - content  → mensagem de alerta a mostrar ao utilizador
//   - onDelete → função a executar quando o utilizador confirmar a eliminação
const DeleteAlert = ({ content, onDelete }) => {
	return (
		<div>
			{/* Mensagem de alerta */}
			<p className='text-sm'>{content}</p>

			{/* Botão de confirmação de eliminação */}
			<div className='flex justify-end mt-6'>
				<button
					type='button'
					className='flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer hover:bg-rose-300'
					onClick={onDelete} // chama a função de eliminação passada como prop
				>
					Apagar
				</button>
			</div>
		</div>
	);
};

export default DeleteAlert;
