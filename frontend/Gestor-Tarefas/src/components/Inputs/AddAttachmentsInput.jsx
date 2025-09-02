import { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';
import { LuPaperclip } from 'react-icons/lu';


// Componente para gerir anexos de uma tarefa
// Props:
//   - attachments → array de links de ficheiros anexados
//   - setAttachments → função para atualizar a lista de anexos
const AddAttachmentsInput = ({ attachments, setAttachments }) => {
	const [option, setOption] = useState(''); // estado temporário para o valor do input

	// Função para adicionar um novo anexo
	const handleAddOption = () => {
		if (option.trim()) {
			// adiciona o novo anexo à lista existente
			setAttachments([...attachments, option.trim()]);
			setOption(''); // limpa o input
		}
	};

	// Função para remover um anexo pelo índice
	const handleDeleteOption = index => {
		const updateArr = attachments.filter((_, i) => i !== index);
		setAttachments(updateArr);
	};
	return (
		<div>
			{/* Lista de anexos já adicionados */}
			{attachments.map((item, index) => (
				<div key={item} className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'>
					{/* Ícone + nome/link do ficheiro */}
					<div className='flex-1 flex items-center gap-3 border border-gray-100'>
						<LuPaperclip className='text-gray-400' />
						<p className='text-xs text-black'>{item}</p>
					</div>
					{/* Botão para remover anexo */}
					<button
						className='cursor-pointer'
						onClick={() => {
							handleDeleteOption(index);
						}}
					>
						<HiOutlineTrash className='text-lg text-red-500' />
					</button>
				</div>
			))}
			{/* Campo para adicionar novos anexos */}
			<div className='flex items-center gap-5 mt-4'>
				<div className='flex-1 flex items-center gap-3 border border-gray-100 px-3 rounded-md'>
					<LuPaperclip className='text-gray-400' />

					<input type='text' placeholder='Add File Link' value={option} onChange={({ target }) => setOption(target.value)} className='w-full text-[13px] text-black outline-none bg-white py-2' />
				</div>
				{/* Botão para adicionar o novo anexo */}
				<button className='card-btn text-nowrap' onClick={handleAddOption}>
					<HiMiniPlus className='text-lg' /> Adicionar
				</button>
			</div>
		</div>
	);
};

export default AddAttachmentsInput;
