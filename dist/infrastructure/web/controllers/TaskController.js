"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const CreateTaskUseCase_1 = require("@application/use-cases/CreateTaskUseCase");
const ListTaskUseCase_1 = require("@application/use-cases/ListTaskUseCase");
const UpdateTaskUseCase_1 = require("@application/use-cases/UpdateTaskUseCase"); // NOVO: Importa o caso de uso de atualização
const DeleteTaskUseCase_1 = require("@application/use-cases/DeleteTaskUseCase"); // NOVO: Importa o caso de uso de exclusão
class TaskController {
    constructor(taskRepository) {
        this.createTaskUseCase = new CreateTaskUseCase_1.CreateTaskUseCase(taskRepository);
        this.listTasksUseCase = new ListTaskUseCase_1.ListTasksUseCase(taskRepository);
        this.updateTaskUseCase = new UpdateTaskUseCase_1.UpdateTaskUseCase(taskRepository); // NOVO: Inicializa o caso de uso
        this.deleteTaskUseCase = new DeleteTaskUseCase_1.DeleteTaskUseCase(taskRepository); // NOVO: Inicializa o caso de uso
    }
    async createTask(req, res) {
        try {
            const { title, description, category, dueDate } = req.body;
            // Validação básica de entrada
            if (!title || !category) {
                return res.status(400).json({ message: 'Título e categoria são obrigatórios.' });
            }
            const newTaskData = {
                title,
                description,
                category,
                dueDate: dueDate ? new Date(dueDate) : undefined,
            };
            const task = await this.createTaskUseCase.execute(newTaskData);
            return res.status(201).json(task);
        }
        catch (error) {
            console.error('Erro ao criar tarefa:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async listTasks(req, res) {
        try {
            const { category, status } = req.query;
            const filters = {};
            if (typeof category === 'string') {
                filters.category = category;
            }
            if (typeof status === 'string' && (status === 'pending' || status === 'completed')) {
                filters.status = status;
            }
            const tasks = await this.listTasksUseCase.execute(filters);
            return res.status(200).json(tasks);
        }
        catch (error) {
            console.error('Erro ao listar tarefas:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const taskData = req.body;
            // Validação básica: ID é obrigatório
            if (!id) {
                return res.status(400).json({ message: 'ID da tarefa é obrigatório.' });
            }
            const updatedTask = await this.updateTaskUseCase.execute(id, taskData);
            if (!updatedTask) {
                return res.status(404).json({ message: 'Tarefa não encontrada.' });
            }
            return res.status(200).json(updatedTask);
        }
        catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            // Validação básica: ID é obrigatório
            if (!id) {
                return res.status(400).json({ message: 'ID da tarefa é obrigatório.' });
            }
            const deleted = await this.deleteTaskUseCase.execute(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Tarefa não encontrada ou já excluída.' });
            }
            return res.status(204).send(); // 204 No Content para exclusão bem-sucedida
        }
        catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
exports.TaskController = TaskController;
