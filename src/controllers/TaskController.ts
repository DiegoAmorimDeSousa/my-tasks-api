// src/controllers/TaskController.ts
import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import { sendMessage } from '../utils/telegram';

export class TaskController {
    /**
     * Lida com as mensagens de webhook recebidas do Telegram.
     * Extrai o ID do chat e o texto da mensagem, tenta parsear os dados da tarefa
     * ou um comando para listar tarefas, e responde adequadamente.
     * @param req Objeto Request do Express.
     * @param res Objeto Response do Express.
     */
    public async handleWebhook(req: Request, res: Response): Promise<Response> {
        try {
            console.log('req.body', JSON.stringify(req.body, null, 2)); 

            const { message } = req.body;

            if (!message || !message.chat || !message.text || !message.from) {
                console.warn('Webhook recebido com estrutura de mensagem inválida ou faltando campos essenciais (chat, text, from):', req.body);
                if (message && message.chat && message.chat.id) {
                    await sendMessage(message.chat.id, '❌ Erro: Formato de mensagem inválido ou dados faltando. Por favor, use o formato "Tarefa: ..., Descrição: ..., Vencimento: ..., Categoria: ..." ou um comando para listar tarefas (ex: "minhas tarefas de hoje").');
                }
                return res.status(400).send('Formato de mensagem inválido');
            }

            const chat_id = message.chat.id;
            const messageText = message.text.toLowerCase(); 
            const user = message.from.first_name || message.from.username || `Usuário ${chat_id}`;

            console.log(`Mensagem recebida do chat ${chat_id} (Usuário: ${user}): ${messageText}`);

            let startDate: Date | undefined;
            let endDate: Date | undefined;
            let listCommandDetected = false;

            const now = new Date();
            now.setHours(0, 0, 0, 0); 

            if (messageText.includes('tarefas de hoje') || messageText.includes('tasks de hoje') || messageText.includes('tarefas hoje')) {
                listCommandDetected = true;
                startDate = new Date(now);
                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999);
            }
            else if (messageText.includes('tarefas dessa semana') || messageText.includes('tasks dessa semana') || messageText.includes('tarefas da semana')) {
                listCommandDetected = true;
                const dayOfWeek = now.getDay();
                startDate = new Date(now);
                startDate.setDate(now.getDate() - dayOfWeek); 
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6); 
                endDate.setHours(23, 59, 59, 999);
            }
            else if (messageText.includes('tarefas dos próximos 7 dias') || messageText.includes('tasks dos próximos 7 dias')) {
                listCommandDetected = true;
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(now);
                endDate.setDate(now.getDate() + 7); 
                endDate.setHours(23, 59, 59, 999);
            }
            else if (messageText.includes('tarefas deste mês') || messageText.includes('tasks deste mês') || messageText.includes('tarefas do mês')) {
                listCommandDetected = true;
                startDate = new Date(now.getFullYear(), now.getMonth(), 1); 
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); 
                endDate.setHours(23, 59, 59, 999);
            }
            else if (messageText.includes('todas as tarefas') || messageText.includes('todas as tasks') || messageText.includes('minhas tarefas')) {
                listCommandDetected = true;
                startDate = undefined;
                endDate = undefined; 
            }

            if (listCommandDetected) {
                let query: any = { user: user }; 
                if (startDate && endDate) {
                    query.dueDate = { $gte: startDate, $lte: endDate };
                } else if (startDate) {
                    query.dueDate = { $gte: startDate };
                }

                const tasks: ITask[] = await Task.find(query);

                if (tasks.length === 0) {
                    await sendMessage(chat_id, 'Nenhuma tarefa encontrada para o período solicitado. 🎉');
                } else {
                    let responseMessage = 'Aqui estão suas tarefas:\n\n';
                    tasks.forEach(task => {
                        const dueDateString = task.dueDate ? ` - Vencimento: ${task.dueDate.toLocaleDateString('pt-BR')}` : '';
                        responseMessage += `*${task.title}*\nDescrição: ${task.description}\nCategoria: ${task.category}${dueDateString}\n\n`;
                    });
                    await sendMessage(chat_id, responseMessage);
                }
                return res.send(); 
            }


            let title: string | undefined;
            let description: string | undefined;
            let dueDate: Date | undefined;
            let category: string | undefined;

            const titleMatch = messageText.match(/tarefa:\s*(.+)/i);
            if (titleMatch && titleMatch[1]) {
                title = titleMatch[1].trim();
            } else {
                await sendMessage(chat_id, '❌ Erro: Título da tarefa não encontrado. Por favor, comece com "Tarefa: [Seu Título]".');
                return res.status(400).send('Título da tarefa faltando');
            }

            const descriptionMatch = messageText.match(/descrição:\s*(.+)/i);
            if (descriptionMatch && descriptionMatch[1]) {
                description = descriptionMatch[1].trim();
            } else {
                await sendMessage(chat_id, '❌ Erro: Descrição da tarefa não encontrada. Por favor, inclua "Descrição: [Sua Descrição]".');
                return res.status(400).send('Descrição da tarefa faltando');
            }

            const categoryMatch = messageText.match(/categoria:\s*(.+)/i);
            if (categoryMatch && categoryMatch[1]) {
                category = categoryMatch[1].trim();
            } else {
                await sendMessage(chat_id, '❌ Erro: Categoria da tarefa não encontrada. Por favor, inclua "Categoria: [Sua Categoria]".');
                return res.status(400).send('Categoria da tarefa faltando');
            }

            const dueDateMatch = messageText.match(/vencimento:\s*(\d{2}\/\d{2})/i); 
            if (dueDateMatch && dueDateMatch[1]) {
                const [day, month] = dueDateMatch[1].split('/').map(Number);
                const currentYear = new Date().getFullYear();
                const parsedDate = new Date(currentYear, month - 1, day, 23, 59, 59);

                if (isNaN(parsedDate.getTime())) {
                    await sendMessage(chat_id, '⚠️ Aviso: Formato de data de vencimento inválido. Tente DD/MM (ex: 20/08). Tarefa criada sem data de vencimento.');
                    dueDate = undefined;
                } else {
                    dueDate = parsedDate;
                }
            } else {
                console.log('Data de vencimento não encontrada ou formato inválido, a tarefa será criada sem data de vencimento.');
            }

            if (!title || !description || !category) {
                await sendMessage(chat_id, '❌ Erro: Não foi possível extrair todas as informações essenciais (Título, Descrição, Categoria) da sua mensagem. Por favor, verifique o formato.');
                return res.status(400).send('Campos essenciais da tarefa faltando após parsing');
            }

            const newTaskData: Partial<ITask> = {
                description,
                category,
                title,
                user,
            };

            if (dueDate) {
                newTaskData.dueDate = dueDate;
            }

            const newTask: ITask = new Task(newTaskData as ITask); 

            await newTask.save(); 

            let confirmationMessage = `✅ Tarefa "${title}" criada com sucesso para ${user}!`;
            if (dueDate) {
                confirmationMessage += ` Vencimento: ${dueDate.toLocaleDateString('pt-BR')}.`;
            } else {
                confirmationMessage += ` (Sem data de vencimento).`;
            }

            await sendMessage(chat_id, confirmationMessage);

            return res.send(); 
        } catch (error) {
            console.error('Erro ao lidar com o webhook e criar/listar tarefa:', error instanceof Error ? error.message : error);
            const chat_id = req.body?.message?.chat?.id;
            if (chat_id) {
                await sendMessage(chat_id, '⚠️ Ocorreu um erro interno ao processar sua solicitação. Por favor, tente novamente mais tarde.');
            }
            return res.status(500).send('Erro Interno do Servidor');
        }
    }

    /**
     * Busca tarefas no banco de dados.
     * Pode filtrar por 'dueDate' se fornecido nos parâmetros de query, caso contrário, retorna todas as tarefas.
     * @param req Objeto Request do Express (parâmetros de query: dueDate).
     * @param res Objeto Response do Express (retorna um array de tarefas).
     */
    public async getTasks(req: Request, res: Response): Promise<Response> {
        try {
            const { dueDate } = req.query;
            let query: any = {};

            if (dueDate) {
                const date = new Date(dueDate as string);
                if (isNaN(date.getTime())) {
                    return res.status(400).json({ message: 'Formato de dueDate inválido. Use YYYY-MM-DD.' });
                }

                const startOfDay = new Date(date);
                startOfDay.setUTCHours(0, 0, 0, 0);

                const endOfDay = new Date(date);
                endOfDay.setUTCHours(23, 59, 59, 999); 

                query.dueDate = {
                    $gte: startOfDay, 
                    $lte: endOfDay    
                };
            }

            const tasks: ITask[] = await Task.find(query); 
            return res.status(200).json(tasks);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error instanceof Error ? error.message : error);
            return res.status(500).send('Erro Interno do Servidor');
        }
    }

    /**
     * Cria uma nova tarefa no banco de dados.
     * @param req Objeto Request do Express (corpo: ITask).
     * @param res Objeto Response do Express (retorna a tarefa criada).
     */
    public async createTask(req: Request, res: Response): Promise<Response> {
        try {
            const { description, category, title, dueDate, user }: ITask = req.body;

            if (!description || !category || !title || !dueDate || !user) {
                return res.status(400).json({ message: 'Todos os campos da tarefa (description, category, title, dueDate, user) são obrigatórios.' });
            }

            const newTask: ITask = new Task({
                description,
                category,
                title,
                dueDate: new Date(dueDate), 
                user,
            });

            await newTask.save(); 
            return res.status(201).json(newTask); 
        } catch (error) {
            console.error('Erro ao criar tarefa:', error instanceof Error ? error.message : error);
            return res.status(500).send('Erro Interno do Servidor');
        }
    }
}
