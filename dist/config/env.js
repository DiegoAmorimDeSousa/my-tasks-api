"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Valida e exporta as variáveis de ambiente
const getEnvVars = () => {
    const port = process.env.PORT;
    const mongoUri = process.env.MONGO_URI;
    if (!port) {
        console.error('Variável de ambiente PORT não definida.');
        process.exit(1);
    }
    if (!mongoUri) {
        console.error('Variável de ambiente MONGO_URI não definida.');
        process.exit(1);
    }
    return {
        PORT: parseInt(port, 10),
        MONGO_URI: mongoUri,
    };
};
exports.env = getEnvVars();
