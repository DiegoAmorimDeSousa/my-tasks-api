"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTaskRepository = void 0;
const TaksModel_1 = require("@infrastructure/database/mongo/models/TaksModel");
class MongoTaskRepository {
    async create(task) {
        const createdTask = await TaksModel_1.TaskModel.create(task);
        return createdTask.toObject({ getters: true }); // Converte para objeto JS puro e aplica getters (para 'id')
    }
    async findById(id) {
        const task = await TaksModel_1.TaskModel.findById(id);
        return task ? task.toObject({ getters: true }) : null;
    }
    async findAll(filters) {
        const query = {};
        if (filters?.category) {
            query.category = filters.category;
        }
        if (filters?.status) {
            query.status = filters.status;
        }
        const tasks = await TaksModel_1.TaskModel.find(query).sort({ createdAt: -1 }); // Ordena por data de criação decrescente
        return tasks.map(task => task.toObject({ getters: true }));
    }
    async update(id, task) {
        // IMPLEMENTAÇÃO ATUALIZADA: Agora o método update está completo
        const updatedTask = await TaksModel_1.TaskModel.findByIdAndUpdate(id, task, { new: true });
        return updatedTask ? updatedTask.toObject({ getters: true }) : null;
    }
    async delete(id) {
        // IMPLEMENTAÇÃO ATUALIZADA: Agora o método delete está completo
        const result = await TaksModel_1.TaskModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}
exports.MongoTaskRepository = MongoTaskRepository;
