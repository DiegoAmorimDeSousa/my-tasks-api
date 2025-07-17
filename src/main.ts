import express from 'express';
import cors from 'cors';
import { connectDB } from '@infrastructure/database/mongo/connection';
import { MongoTaskRepository } from '@infrastructure/database/mongo/repositories/MongoTaskRepository';
import { taskRoutes } from '@infrastructure/web/routes/task.routes';
import { env } from '@config/env';

const app = express();

// Middlewares
app.use(cors()); // Permite requisições de diferentes origens (para o dashboard Vite)
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Conecta ao banco de dados
connectDB();

// Instancia o repositório (implementação concreta)
const taskRepository = new MongoTaskRepository();

// Configura as rotas da API, injetando o repositório
app.use('/api/tasks', taskRoutes(taskRepository));

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Task Flow está funcionando!');
});

// Inicia o servidor
app.listen(env.PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${env.PORT}`);
  console.log(`Acesse: http://localhost:${env.PORT}`);
});