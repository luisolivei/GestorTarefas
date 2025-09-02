import { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';

// Componente para gerir uma lista de tarefas (to-do list)
// Props:
//   - todoList    → array de tarefas
//   - setTodoList → função para atualizar a lista de tarefas
const TodoListInput = ({ todoList, setTodoList }) => {
	const [option, setOption] = useState(''); // estado temporário para o input

	// Função para adicionar uma nova tarefa
	const handleAddOption = () => {
		if (option.trim()) {
			setTodoList([...todoList, option.trim()]); // adiciona a nova tarefa à lista
			setOption(''); // limpa o input
		}
	};

	// Função para remover uma tarefa pelo índice
	const handleDeleteOption = index => {
		const updateArr = todoList.filter((_, idx) => idx !== index);
		setTodoList(updateArr);
	};
	return (
		<div>
			{/* Lista de tarefas */}
			{todoList.map((item, index) => (
				<div key={item} className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'>
					<p className='text-xs text-black'>
						{/* Número da tarefa com zero à esquerda */}
						<span className='text-xs text-gray-400 font-semibold mr-2'>{index < 9 ? `0${index + 1}` : index + 1}</span>
						{item}
					</p>
					{/* Botão para remover tarefa */}
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
			{/* Input e botão para adicionar novas tarefas */}
			<div className='flex items-center gap-4 mt-4'>
				<input
					type='text'
					placeholder='Insira uma subtarefa'
					value={option}
					onChange={({ target }) => setOption(target.value)}
					className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md'
				/>
				<button className='card-btn text-nowrap' onClick={handleAddOption}>
					<HiMiniPlus className='text-lg' /> Adicionar
				</button>
			</div>
		</div>
	);
};

export default TodoListInput;
