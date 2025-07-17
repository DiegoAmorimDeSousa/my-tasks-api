import { Task } from '@domain/entities/Task';

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(filters?: { category?: string; status?: 'pending' | 'completed' }): Promise<Task[]>;
  update(id: string, task: Partial<Task>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}