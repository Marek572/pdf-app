import { Request, Response } from 'express';
import {
  addPdfField,
  getPdfFields,
  removeFieldByName,
  removeFieldsValues,
  updateFieldSize,
} from '../services/pdf.service';
import { PdfStorageService } from '../services/pdf-storage.service';

const pdfStorage = new PdfStorageService();

export const uploadPdf = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    pdfStorage.uploadPdf(req.file.buffer, req.file.originalname);
    return res.status(200).json({
      message: 'File uploaded successfully',
      fileName: req.file.originalname,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to upload file' });
  }
};

export const addPdfFields = async (req: Request, res: Response) => {
  const pageIndex: number = Number(req.body.pageIndex);
  const x: number = Number(req.body.x);
  const y: number = Number(req.body.y);
  const width: number = Number(req.body.width);
  const height: number = Number(req.body.height);
  const rotation: number = Number(req.body.rotation);

  try {
    if (!pdfStorage.hasPdf())
      return res.status(400).json({ message: 'No PDF file uploaded. Please upload a file first.' });

    const fileName = pdfStorage.getFileName();
    const fileBuffer = pdfStorage.getCurrentPdf();

    const modifiedBuffer = await addPdfField(fileBuffer, pageIndex, x, y, width, height, rotation);

    pdfStorage.updateCurrentPdf(Buffer.from(modifiedBuffer));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(Buffer.from(modifiedBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add PDF field');
  }
};

export const updatePdfFields = async (req: Request, res: Response) => {
  try {
    if (!pdfStorage.hasPdf())
      return res.status(400).json({ message: 'No original PDF file. Please upload a file first.' });

    const fileName = pdfStorage.getFileName();
    const modifiedBuffer = req.file!.buffer;

    pdfStorage.updateCurrentPdf(modifiedBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(Buffer.from(modifiedBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update PDF fields');
  }
};

export const clearPdfFields = async (req: Request, res: Response) => {
  try {
    if (!pdfStorage.hasPdf())
      return res.status(400).json({ message: 'No PDF file uploaded. Please upload a file first.' });

    const fileName = pdfStorage.getFileName();
    const fileBuffer = pdfStorage.getCurrentPdf();

    const fields = await getPdfFields(fileBuffer);

    if (fields.length === 0)
      return res.status(400).json({ error: { message: 'No form fields found in the PDF' } });

    const modifiedBuffer = await removeFieldsValues(fileBuffer);

    pdfStorage.updateCurrentPdf(Buffer.from(modifiedBuffer));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(Buffer.from(modifiedBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to remove field values');
  }
};

export const removePdfField = async (req: Request, res: Response) => {
  const fieldName: string = req.params.fieldName!;

  try {
    if (!pdfStorage.hasPdf())
      return res.status(400).json({ message: 'No PDF file uploaded. Please upload a file first.' });

    const fileName = pdfStorage.getFileName();
    const fileBuffer = pdfStorage.getCurrentPdf();

    const modifiedBuffer = await removeFieldByName(fileBuffer, fieldName);

    pdfStorage.updateCurrentPdf(Buffer.from(modifiedBuffer));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(Buffer.from(modifiedBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to remove PDF field');
  }
};

export const updatePdfFieldSize = async (req: Request, res: Response) => {
  const fieldName: string = req.params.fieldName!;
  const pageWidth: number = Number(req.body.pageWidth);
  const pageHeight: number = Number(req.body.pageHeight);
  const width: number = Number(req.body.width);
  const height: number = Number(req.body.height);

  try {
    if (!pdfStorage.hasPdf())
      return res.status(400).json({ message: 'No PDF file uploaded. Please upload a file first.' });

    const fileName = pdfStorage.getFileName();
    const fileBuffer = pdfStorage.getCurrentPdf();

    const modifiedBuffer = await updateFieldSize(
      fileBuffer,
      fieldName,
      pageWidth,
      pageHeight,
      width,
      height
    );

    pdfStorage.updateCurrentPdf(Buffer.from(modifiedBuffer));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(Buffer.from(modifiedBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update PDF field size');
  }
};
