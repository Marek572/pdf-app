import { Request, Response } from 'express';

import {
  addPdfField,
  getPdfFields,
  removeFieldByName,
  removeFieldsValues,
  updateFieldSize,
} from '../services/pdf.service';
import { PdfStorageService } from '../services/pdf-storage.service';
import { HTTPStatusCodes } from '../utils/http-status-codes';
import { NewPdfFieldParams, UpdatePdfFieldSizeParams } from '../models/interfaces';
import { sendPdfResponse, handleServerError, handleNoPdfError } from '../utils/response.utils';

const pdfStorage = new PdfStorageService();

export const uploadPdf = async (req: Request, res: Response) => {
  if (!req.file) return handleBadRequest(res, 'No file uploaded');

  try {
    const { buffer, originalname } = req.file;

    pdfStorage.uploadPdf(buffer, originalname);
    return res.status(HTTPStatusCodes.OK).json({
      message: 'File uploaded successfully',
      fileName: originalname,
    });
  } catch (err) {
    return handleServerError(res, err, 'Failed to upload file');
  }
};

export const addPdfFields = async (req: Request, res: Response) => {
  try {
    if (!pdfStorage.hasPdf()) return handleNoPdfError(res);

    const fileName = pdfStorage.getFileName();
    const fileBuffer = pdfStorage.getCurrentPdf();

    const { pageIndex, x, y, canvasWidth, canvasHeight, rotation } = req.body;
    const newFieldsParams: NewPdfFieldParams = {
      pageIndex,
      x,
      y,
      canvasWidth,
      canvasHeight,
      rotation,
    };

    const modifiedBuffer = await addPdfField(fileBuffer, newFieldsParams);
    sendPdfResponse(res, fileName, modifiedBuffer, pdfStorage);
  } catch (err) {
    handleServerError(res, err, 'Failed to add PDF field');
  }
};

export const updatePdfFields = async (req: Request, res: Response) => {
  try {
    if (!pdfStorage.hasPdf()) return handleNoPdfError(res);

    const fileName = pdfStorage.getFileName();
    const modifiedBuffer = req.file!.buffer;

    sendPdfResponse(res, fileName, modifiedBuffer, pdfStorage);
  } catch (err) {
    handleServerError(res, err, 'Failed to update PDF fields');
  }
};

export const clearPdfFields = async (req: Request, res: Response) => {
  try {
    if (!pdfStorage.hasPdf()) return handleNoPdfError(res);

    const fileName = pdfStorage.getFileName();
    const fileBuffer = pdfStorage.getCurrentPdf();

    const fields = await getPdfFields(fileBuffer);

    if (fields.length === 0)
      return res
        .status(HTTPStatusCodes.NotFound)
        .json({ error: { message: 'No form fields found in the PDF' } });

    const modifiedBuffer = await removeFieldsValues(fileBuffer);
    sendPdfResponse(res, fileName, modifiedBuffer, pdfStorage);
  } catch (err) {
    handleServerError(res, err, 'Failed to remove field values');
  }
};

export const removePdfField = async (req: Request, res: Response) => {
  const fieldName: string = decodeURIComponent(req.params.fieldName!);

  try {
    if (!pdfStorage.hasPdf()) return handleNoPdfError(res);

    const fileName = pdfStorage.getFileName();
    const fileBuffer = pdfStorage.getCurrentPdf();

    const modifiedBuffer = await removeFieldByName(fileBuffer, fieldName);
    sendPdfResponse(res, fileName, modifiedBuffer, pdfStorage);
  } catch (err) {
    handleServerError(res, err, 'Failed to remove PDF field');
  }
};

export const updatePdfFieldSize = async (req: Request, res: Response) => {
  const fieldName: string = decodeURIComponent(req.params.fieldName!);

  try {
    if (!pdfStorage.hasPdf()) return handleNoPdfError(res);

    const fileName = pdfStorage.getFileName();
    const fileBuffer = pdfStorage.getCurrentPdf();

    const { canvasWidth, canvasHeight, width, height } = req.body;
    const updatedField: UpdatePdfFieldSizeParams = {
      canvasWidth,
      canvasHeight,
      width,
      height,
    };

    console.log('Decoded Field Name:', fieldName);

    const modifiedBuffer = await updateFieldSize(fileBuffer, fieldName, updatedField);
    sendPdfResponse(res, fileName, modifiedBuffer, pdfStorage);
  } catch (err) {
    handleServerError(res, err, 'Failed to update PDF field size');
  }
};
function handleBadRequest(res: Response<any, Record<string, any>>, arg1: string) {
  throw new Error('Function not implemented.');
}
