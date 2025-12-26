export interface NewPdfFieldParams {
  pageIndex: number;
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  rotation: number;
}

export interface UpdatePdfFieldSizeParams {
  canvasWidth: number;
  canvasHeight: number;
  width: number;
  height: number;
}

export interface GetPdfFields {
  name: string;
  type: string;
}
