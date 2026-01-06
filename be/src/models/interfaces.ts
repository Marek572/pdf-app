export interface NewPdfFieldParams {
  pageIndex: number;
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  rotation: number;
}

export interface UpdatePdfFieldParams {
  canvasWidth?: number;
  canvasHeight?: number;
  width?: number;
  height?: number;
  newName?: string;
}

export interface GetPdfFields {
  name: string;
  type: string;
}
