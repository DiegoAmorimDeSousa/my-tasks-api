import dotenv from 'dotenv';
dotenv.config();

// Define uma interface para as variáveis de ambiente
interface EnvVars {
  PORT: number;
  MONGO_URI: string;
}

// Valida e exporta as variáveis de ambiente
const getEnvVars = (): EnvVars => {
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

export const env = getEnvVars();