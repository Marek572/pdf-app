import express, { Request, Response } from 'express'
import cors from 'cors';
import multer from 'multer';
import { getPdfFields } from './pdf-service';

const app = express()
const port = 3000

// app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//PDF

app.post('/pdf/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fields = await getPdfFields(req.file.buffer);
    res.json({
      message: 'File uploaded successfully',
      fields
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to parse PDF");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})