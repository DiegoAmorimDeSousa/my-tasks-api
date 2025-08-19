import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import dotenv from 'dotenv';

dotenv.config(); 

const router = Router();
const taskController = new TaskController();

const WEBHOOK_END = '/webhook/' + process.env.TELEGRAM_BOT_TOKEN;;

router.post(WEBHOOK_END, taskController.handleWebhook);

router.post('/test', () => {
  console.log('aloo')
})

router.get('/tasks', taskController.getTasks);
router.post('/tasks', taskController.createTask);

export default router;
