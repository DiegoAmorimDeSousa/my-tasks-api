import { Task } from '@domain/entities/Task';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';

export class ListTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(filters?: { category?: string; status?: 'pending' | 'completed' }): Promise<Task[]> {
    // Regras de negócio para listagem (ex: ordenar por data, filtrar por usuário, etc.)
    return this.taskRepository.findAll(filters);
  }
}