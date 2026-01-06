import { PdfRotation } from './types';

export interface AddFieldRequest {
  pageIndex: number;
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  rotation: PdfRotation;
}

interface FieldSizeChangeRequest {
  newName?: string;
  canvasWidth: number;
  canvasHeight: number;
  width: number;
  height: number;
}

interface FieldRenameRequest {
  newName: string;
}

export type FieldChangeRequest = FieldSizeChangeRequest | FieldRenameRequest;

export interface PageSize {
  width: number;
  height: number;
}
