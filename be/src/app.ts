import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { getPdfFields } from './pdf-service';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

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
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/pdf/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Read the file from disk to get the buffer
    const fileBuffer = fs.readFileSync(req.file.path);
    const fields = await getPdfFields(fileBuffer);
    res.json({
      message: 'File uploaded successfully',
      fields,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to parse PDF');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
