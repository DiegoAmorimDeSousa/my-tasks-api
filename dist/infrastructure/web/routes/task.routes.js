"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = taskRoutes;
const express_1 = require("express");
const TaskController_1 = require("@infrastructure/web/controllers/TaskController");
function taskRoutes(taskRepository) {
    const router = (0, express_1.Router)();
    const taskController = new TaskController_1.TaskController(taskRepository);
    router.post('/', (req, res) => taskController.createTask(req, res));
    router.get('/', (req, res) => taskController.listTasks(req, res));
    router.put('/:id', (req, res) => taskController.updateTask(req, res)); // NOVO: Rota para atualizar tarefa
    router.delete('/:id', (req, res) => taskController.deleteTask(req, res)); // NOVO: Rota para excluir tarefa
    return router;
}
