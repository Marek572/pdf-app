import { PdfRotation } from './types';

export interface UploadPdfResponse {
  fileName: string;
}

export interface AddFieldRequest {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: PdfRotation;
}

export interface FieldSizeChangeRequest {
  pageWidth: number;
  pageHeight: number;
  width: number;
  height: number;
}

export interface PageSize {
  width: number;
  height: number;
}
