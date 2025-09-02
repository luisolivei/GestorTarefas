const mongoose = require('mongoose');

// Esquema para cada item da checklist de uma tarefa
const todoSchema = new mongoose.Schema({
	task: { type: String, required: true }, // Descrição da tarefa da checklist
	completed: { type: Boolean, default: false }, // Estado de conclusão (true/false)
});

// Esquema principal da tarefa
const taskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true }, // Título da tarefa
		description: { type: String }, // Descrição detalhada da tarefa
		priority: {
			type: String,
			enum: ['Baixa', 'Media', 'Alta'], // Apenas valores permitidos
			default: 'Media', // Valor por defeito
		},
		status: {
			type: String,
			enum: ['Pendente', 'Em Progresso', 'Concluída'],
			default: 'Pendente', // Estado inicial da tarefa
		},
		dueDate: {
			type: Date,
			default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Prazo por defeito: 1 semana
		},
		assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // IDs de utilizadores atribuídos
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID do utilizador que criou a tarefa
		attachments: [{ type: String }], // Lista de URLs de anexos
		todoChecklist: [todoSchema], // Checklist de subtarefas
		progress: { type: Number, default: 0 }, // Percentagem de progresso da tarefa
	},
	{ timestamps: true }, // Adiciona automaticamente campos createdAt e updatedAt
);

// Criar o modelo da tarefa com base no esquema
module.exports = mongoose.model('Task', taskSchema);
