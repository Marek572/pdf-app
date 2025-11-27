import express from 'express';
import cors from 'cors';

import pdfRoutes from './routes/pdf.routes';
import { PORT } from './config/server.config';

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use('/pdf', pdfRoutes);

//Run
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
