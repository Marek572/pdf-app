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

router.post('/fields', addPdfFields);
router.put('/fields', uploadMiddleware.single('file'), updatePdfFields);
router.delete('/fields/values', clearPdfFields);
router.delete('/fields/:fieldName', removePdfField);
router.put('/fields/:fieldName', updatePdfFieldSize);

export default router;
