import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdf.routes';
import { uploadDir, PORT } from './config/server.config';
import { cleanUploadDir, ensureUploadDir } from './utils';

const app = express();

app.use(cors());
app.use(express.json());

ensureUploadDir(uploadDir);
cleanUploadDir(uploadDir);

//Routes
app.use('/pdf', pdfRoutes);

//Run
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
