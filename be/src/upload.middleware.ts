import multer from 'multer';
import { uploadDir } from './config/server.config';

export const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});
