import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import connectDB from './config/db'; 
import apiRoutes from './routes';   

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_API = process.env.WEBHOOK_API;
const TELEGRAM_API = process.env.TELEGRAM_API;

const TEL_API = `${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}`;
const WEBHOOK_END = '/api/webhook/' + TELEGRAM_BOT_TOKEN;
const WEBHOOK = WEBHOOK_API + WEBHOOK_END;

const setWebhookUrk = async () => {
    console.log('`${TEL_API}/setWebhook?url=${WEBHOOK}`', `${TEL_API}/setWebhook?url=${WEBHOOK}`)
  const res = await axios.get(`${TEL_API}/setWebhook?url=${WEBHOOK}`);
  console.log(`Webhook setado - ${JSON.stringify(res.data)}`);
}

connectDB();

app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('My Tasks API está rodando!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse as tarefas em http://localhost:${PORT}/api/tasks`);
    console.log(`O Webhook do Telegram escuta em http://localhost:${PORT}/api${process.env.WEBHOOK_END || '/webhook'}`);
    setWebhookUrk();
});
