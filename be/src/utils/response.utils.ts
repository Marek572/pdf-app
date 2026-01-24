import { Response } from 'express';

import { HTTPStatusCodes } from './http-status-codes';
import { PdfStorageService } from '../services/pdf-storage.service';

export const handleBadRequest = (res: Response, message: string) => {
  return res.status(HTTPStatusCodes.BadRequest).json({ message });
};

export const handleNoPdfError = (res: Response) => {
  return res
    .status(HTTPStatusCodes.BadRequest)
    .json({ message: 'No PDF file uploaded. Please upload a file first.' });
};

export const handleServerError = (res: Response, err: unknown, message: string) => {
  console.error(err);
  return res.status(HTTPStatusCodes.InternalServerError).send(message);
};

export const sendPdfResponse = (
  res: Response,
  fileName: string,
  buffer: Uint8Array | Buffer,
  storageService: PdfStorageService
) => {
  const finalBuffer = Buffer.from(buffer);
  storageService.updateCurrentPdf(finalBuffer);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.status(HTTPStatusCodes.OK).send(finalBuffer);
};
