import dotenv from 'dotenv';

// Load .env
dotenv.config();

export const PORT: number = Number(process.env.PORT ?? 3000);
