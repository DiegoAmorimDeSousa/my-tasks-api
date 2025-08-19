import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;

        if (!mongoUrl) {
            throw new Error('MONGO_URL environment variable is not defined.');
        }

        await mongoose.connect(mongoUrl);
        console.log('MongoDB conectado com sucesso!');
    } catch (error) {
        console.error('Erro de conexão ao MongoDB:', error);
        process.exit(1); 
    }
};

export default connectDB;
