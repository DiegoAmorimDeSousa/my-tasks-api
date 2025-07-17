import { Task } from '@domain/entities/Task';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskData: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    // Regras de negócio podem ser aplicadas aqui antes de criar a tarefa
    const newTask: Task = {
      ...taskData,
      status: 'pending', // Tarefa sempre começa como pendente
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.taskRepository.create(newTask);
  }
}