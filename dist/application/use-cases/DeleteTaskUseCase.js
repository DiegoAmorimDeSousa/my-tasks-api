"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTaskUseCase = void 0;
class DeleteTaskUseCase {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async execute(id) {
        // Regras de negócio para exclusão (ex: verificar permissões)
        return this.taskRepository.delete(id);
    }
}
exports.DeleteTaskUseCase = DeleteTaskUseCase;
