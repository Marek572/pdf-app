import { PdfRotation } from './types';

export interface UploadPdfResponse {
  fileName: string;
}

export interface AddFieldRequest {
  pageIndex: number;
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  rotation: PdfRotation;
}

export interface FieldSizeChangeRequest {
  canvasWidth: number;
  canvasHeight: number;
  width: number;
  height: number;
}

export interface PageSize {
  width: number;
  height: number;
}
