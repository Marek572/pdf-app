import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { uploadDir } from '../config/server.config';
import { getPdfFields, removeFieldsValues } from '../services/pdf.service';

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    return res.status(200).json({ fileName: req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to upload PDF');
  }
};

export const clearPdfFields = async (req: Request, res: Response) => {
  const { fileName } = req.params;

  try {
    if (!fileName) return res.status(400).json({ message: 'No filename provided' });

    const filePath = path.join(uploadDir, fileName);
    const fileBuffer = fs.readFileSync(filePath);
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
    res.status(500).send('Failed to remove field values');
  }
};
