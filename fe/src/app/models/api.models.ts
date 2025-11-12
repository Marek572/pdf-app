export interface UploadPdfResponse {
  fileName: string;
}

export interface AddFieldRequest {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
