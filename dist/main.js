"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = require("@infrastructure/database/mongo/connection");
const MongoTaskRepository_1 = require("@infrastructure/database/mongo/repositories/MongoTaskRepository");
const task_routes_1 = require("@infrastructure/web/routes/task.routes");
const env_1 = require("@config/env");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)()); // Permite requisições de diferentes origens (para o dashboard Vite)
app.use(express_1.default.json()); // Habilita o parsing de JSON no corpo das requisições
// Conecta ao banco de dados
(0, connection_1.connectDB)();
// Instancia o repositório (implementação concreta)
const taskRepository = new MongoTaskRepository_1.MongoTaskRepository();
// Configura as rotas da API, injetando o repositório
app.use('/api/tasks', (0, task_routes_1.taskRoutes)(taskRepository));
// Rota de teste
app.get('/', (req, res) => {
    res.send('API Task Flow está funcionando!');
});
// Inicia o servidor
app.listen(env_1.env.PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${env_1.env.PORT}`);
    console.log(`Acesse: http://localhost:${env_1.env.PORT}`);
});
