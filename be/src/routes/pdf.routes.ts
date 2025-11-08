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
router.put('/:fileName/addField', uploadMiddleware.none(), addPdfFields);
router.put('/:fileName/updateFields', uploadMiddleware.single('file'), updatePdfFields);
router.put('/:fileName/clearFields', clearPdfFields);

export default router;
