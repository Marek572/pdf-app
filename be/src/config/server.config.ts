import path from 'path';
import dotenv from 'dotenv';

// Load .env
dotenv.config();

export const PORT: number = Number(process.env.PORT ?? 3000);

export const uploadDir: string = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(process.cwd(), 'uploads');
