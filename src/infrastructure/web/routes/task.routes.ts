import { Router } from 'express';
import { TaskController } from '@infrastructure/web/controllers/TaskController';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';

export function taskRoutes(taskRepository: ITaskRepository): Router {
  const router = Router();
  const taskController = new TaskController(taskRepository);

  router.post('/', (req, res) => taskController.createTask(req, res));
  router.get('/', (req, res) => taskController.listTasks(req, res));
  router.put('/:id', (req, res) => taskController.updateTask(req, res));   // NOVO: Rota para atualizar tarefa
  router.delete('/:id', (req, res) => taskController.deleteTask(req, res)); // NOVO: Rota para excluir tarefa

  return router;
}