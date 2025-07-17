import { Task } from '@domain/entities/Task';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    // Regras de negócio para atualização (ex: validar campos, permissões)
    const updatedData = { ...taskData, updatedAt: new Date() };
    return this.taskRepository.update(id, updatedData);
  }
}