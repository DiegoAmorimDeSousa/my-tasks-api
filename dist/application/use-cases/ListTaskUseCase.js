"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTasksUseCase = void 0;
class ListTasksUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async execute(filters) {
        // Regras de negócio para listagem (ex: ordenar por data, filtrar por usuário, etc.)
        return this.taskRepository.findAll(filters);
    }
}
exports.ListTasksUseCase = ListTasksUseCase;
