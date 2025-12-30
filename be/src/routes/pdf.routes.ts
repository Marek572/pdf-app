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

router.post('/file', uploadMiddleware.single('file'), uploadPdf);
router.put('/file', uploadMiddleware.single('file'), updatePdfFields);

router.post('/fields', addPdfFields);
router.delete('/fields/values', clearPdfFields);
router.delete('/fields/:fieldName', removePdfField);
router.patch('/fields/:fieldName', updatePdfFieldSize);

export default router;
