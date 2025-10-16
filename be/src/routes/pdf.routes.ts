import express from 'express';
import { uploadMiddleware } from '../upload.middleware';
import { uploadPdf, clearPdfFields } from '../controllers/pdf.controller';

const router = express.Router();

router.post('/upload', uploadMiddleware.single('file'), uploadPdf);
router.put('/:fileName', clearPdfFields);

export default router;
