import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Task';
import { TaskModel, TaskDocument } from '@infrastructure/database/mongo/models/TaksModel';

export class MongoTaskRepository implements ITaskRepository {
  async create(task: Task): Promise<Task> {
    const createdTask = await TaskModel.create(task);
    return createdTask.toObject({ getters: true }); // Converte para objeto JS puro e aplica getters (para 'id')
  }

  async findById(id: string): Promise<Task | null> {
    const task = await TaskModel.findById(id);
    return task ? task.toObject({ getters: true }) : null;
  }

  async findAll(filters?: { category?: string; status?: 'pending' | 'completed' }): Promise<Task[]> {
    const query: any = {};
    if (filters?.category) {
      query.category = filters.category;
    }
    if (filters?.status) {
      query.status = filters.status;
    }
    const tasks = await TaskModel.find(query).sort({ createdAt: -1 }); // Ordena por data de criação decrescente
    return tasks.map(task => task.toObject({ getters: true }));
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    // IMPLEMENTAÇÃO ATUALIZADA: Agora o método update está completo
    const updatedTask = await TaskModel.findByIdAndUpdate(id, task, { new: true });
    return updatedTask ? updatedTask.toObject({ getters: true }) : null;
  }

  async delete(id: string): Promise<boolean> {
    // IMPLEMENTAÇÃO ATUALIZADA: Agora o método delete está completo
    const result = await TaskModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
