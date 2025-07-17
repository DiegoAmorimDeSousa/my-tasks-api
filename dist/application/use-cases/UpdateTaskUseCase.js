"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskUseCase = void 0;
class UpdateTaskUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async execute(id, taskData) {
        // Regras de negócio para atualização (ex: validar campos, permissões)
        const updatedData = { ...taskData, updatedAt: new Date() };
        return this.taskRepository.update(id, updatedData);
    }
}
exports.UpdateTaskUseCase = UpdateTaskUseCase;
