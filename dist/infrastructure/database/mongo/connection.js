"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("@config/env");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.env.MONGO_URI);
        console.log('📦 Conectado ao MongoDB!');
    }
    catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error);
        process.exit(1); // Sai do processo em caso de erro de conexão
    }
};
exports.connectDB = connectDB;
