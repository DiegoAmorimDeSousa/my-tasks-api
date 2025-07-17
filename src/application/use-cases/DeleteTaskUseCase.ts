import { ITaskRepository } from '@domain/repositories/ITaskRepository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<boolean> {
    // Regras de negócio para exclusão (ex: verificar permissões)
    return this.taskRepository.delete(id);
  }
}