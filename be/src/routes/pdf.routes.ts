import express from 'express';
import { uploadMiddleware } from '../upload.middleware';
import {
  uploadPdf,
  clearPdfFields,
  addPdfFields,
  updatePdfFields,
} from '../controllers/pdf.controller';

const router = express.Router();

router.post('/upload', uploadMiddleware.single('file'), uploadPdf);
router.put('/addField', uploadMiddleware.single('body'), addPdfFields);
router.put('/updateFields', uploadMiddleware.single('file'), updatePdfFields);
router.put('/clearFields', clearPdfFields);

export default router;
