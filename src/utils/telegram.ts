import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); 

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = process.env.TELEGRAM_API;

/**
 * Envia uma mensagem para um chat específico do Telegram.
 * @param chatId O ID do chat para o qual a mensagem será enviada.
 * @param text O texto da mensagem a ser enviada.
 */
export const sendMessage = async (chatId: number, text: string): Promise<void> => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_API) {
        console.error('Token do bot do Telegram ou URL da API não definidos nas variáveis de ambiente.');
        return;
    }
    try {
        await axios.post(`${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: text
        });
        console.log(`Mensagem enviada para o chat ${chatId}: ${text}`);
    } catch (error) {
        console.error('Erro ao enviar mensagem para o Telegram:', error instanceof Error ? error.message : error);
    }
};
