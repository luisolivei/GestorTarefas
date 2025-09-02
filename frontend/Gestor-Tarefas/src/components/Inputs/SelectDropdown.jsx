import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

// Componente SelectDropdown personalizado
// Props:
//   - options     → array de opções { value, label }
//   - value       → valor atualmente selecionado
//   - onChange    → função chamada quando o utilizador seleciona uma opção
//   - placeholder → texto a mostrar quando não há opção selecionada
const SelectDropdown = ({ options, value, onChange, placeholder }) => {
	const [isOpen, setIsOpen] = useState(false); // estado para controlar se o dropdown está aberto
	// Função para selecionar uma opção
	const handleSelect = option => {
		onChange(option); // atualiza o valor selecionado
		setIsOpen(false); // fecha o dropdown
	};
	return (
		<div className='realative w-full'>
			{/* Botão principal do dropdown */}
			<button onClick={() => setIsOpen(!isOpen)} className='w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center'>
				{/* Mostra o valor selecionado ou o placeholder */}
				{value ? options.find(opt => opt.value === value)?.label : placeholder}
				{/* Ícone de seta, roda quando o dropdown está aberto */}
				<span className='ml-2'>{isOpen ? <LuChevronDown className='rotate-180' /> : <LuChevronDown />}</span>
			</button>

			{/* Menu do dropdown */}
			{isOpen && (
				<div className='absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10'>
					{options.map(option => (
						<div key={option.value} onClick={() => handleSelect(option.value)} className='px-3 py-2 text-sm cursor-pointer hover:bg-gray-100'>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SelectDropdown;
