import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { getPdfFields, removeFieldsValues } from './pdf-service';
import fs from 'fs';
import path from 'path';

const app = express();
const port: number = 3000;

app.use(cors());

// Define uploads directory and ensure it exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Clear the uploads directory on startup
fs.readdir(uploadDir, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(uploadDir, file), (err) => {
      if (err) throw err;
    });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/pdf/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    return res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to parse PDF');
  }
});

app.put('/pdf/:fileName', async (req: Request, res: Response) => {
  const { fileName } = req.params;

  try {
    if (!fileName) {
      return res.status(400).json({ message: 'No filename provided' });
    }
    const filePath: string = path.join(uploadDir, fileName);
    const fileBuffer: Buffer = fs.readFileSync(filePath);
    const fields = await getPdfFields(fileBuffer);

    if (fields.length === 0) {
      return res.status(400).json({ error: { message: 'No form fields found in the PDF' } });
    }

    const modifiedBuffer = await removeFieldsValues(fileBuffer);

    fs.writeFileSync(filePath, modifiedBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(Buffer.from(modifiedBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to remove fields values');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
