"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskUseCase = void 0;
class CreateTaskUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async execute(taskData) {
        // Regras de negócio podem ser aplicadas aqui antes de criar a tarefa
        const newTask = {
            ...taskData,
            status: 'pending', // Tarefa sempre começa como pendente
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return this.taskRepository.create(newTask);
    }
}
exports.CreateTaskUseCase = CreateTaskUseCase;
