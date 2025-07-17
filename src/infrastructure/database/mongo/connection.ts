import mongoose from 'mongoose';
import { env } from '@config/env';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('📦 Conectado ao MongoDB!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Sai do processo em caso de erro de conexão
  }
};