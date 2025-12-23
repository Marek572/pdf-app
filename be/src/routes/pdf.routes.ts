import express from 'express';
import { uploadMiddleware } from '../upload.middleware';
import {
  uploadPdf,
  clearPdfFields,
  addPdfFields,
  updatePdfFields,
  removePdfField,
  updatePdfFieldSize,
} from '../controllers/pdf.controller';

const router = express.Router();

router.post('/upload', uploadMiddleware.single('file'), uploadPdf);
router.put('/addField', uploadMiddleware.single('body'), addPdfFields);
router.put('/updateFields', uploadMiddleware.single('file'), updatePdfFields);
router.put('/clearFields', clearPdfFields);
router.delete('/removeField/:fieldName', removePdfField);
router.put('/updateFieldSize/:fieldName', uploadMiddleware.single('body'), updatePdfFieldSize);

export default router;
