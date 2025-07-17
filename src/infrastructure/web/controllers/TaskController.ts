import { Request, Response } from 'express';
import { CreateTaskUseCase } from '@application/use-cases/CreateTaskUseCase';
import { ListTasksUseCase } from '@application/use-cases/ListTaskUseCase';
import { UpdateTaskUseCase } from '@application/use-cases/UpdateTaskUseCase'; // NOVO: Importa o caso de uso de atualização
import { DeleteTaskUseCase } from '@application/use-cases/DeleteTaskUseCase'; // NOVO: Importa o caso de uso de exclusão
import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Task';

export class TaskController {
  private createTaskUseCase: CreateTaskUseCase;
  private listTasksUseCase: ListTasksUseCase;
  private updateTaskUseCase: UpdateTaskUseCase; // NOVO: Instância do caso de uso de atualização
  private deleteTaskUseCase: DeleteTaskUseCase; // NOVO: Instância do caso de uso de exclusão

  constructor(taskRepository: ITaskRepository) {
    this.createTaskUseCase = new CreateTaskUseCase(taskRepository);
    this.listTasksUseCase = new ListTasksUseCase(taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(taskRepository); // NOVO: Inicializa o caso de uso
    this.deleteTaskUseCase = new DeleteTaskUseCase(taskRepository); // NOVO: Inicializa o caso de uso
  }

  async createTask(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, category, dueDate } = req.body;

      // Validação básica de entrada
      if (!title || !category) {
        return res.status(400).json({ message: 'Título e categoria são obrigatórios.' });
      }

      const newTaskData: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        title,
        description,
        category,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      };

      const task = await this.createTaskUseCase.execute(newTaskData);
      return res.status(201).json(task);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  async listTasks(req: Request, res: Response): Promise<Response> {
    try {
      const { category, status } = req.query;

      const filters: { category?: string; status?: 'pending' | 'completed' } = {};
      if (typeof category === 'string') {
        filters.category = category;
      }
      if (typeof status === 'string' && (status === 'pending' || status === 'completed')) {
        filters.status = status;
      }

      const tasks = await this.listTasksUseCase.execute(filters);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  async updateTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const taskData = req.body;

      // Validação básica: ID é obrigatório
      if (!id) {
        return res.status(400).json({ message: 'ID da tarefa é obrigatório.' });
      }

      const updatedTask = await this.updateTaskUseCase.execute(id, taskData);

      if (!updatedTask) {
        return res.status(404).json({ message: 'Tarefa não encontrada.' });
      }

      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Validação básica: ID é obrigatório
      if (!id) {
        return res.status(400).json({ message: 'ID da tarefa é obrigatório.' });
      }

      const deleted = await this.deleteTaskUseCase.execute(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Tarefa não encontrada ou já excluída.' });
      }

      return res.status(204).send(); // 204 No Content para exclusão bem-sucedida
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}