export enum PdfRotationAngle {
  Deg0 = 0,
  Deg90 = 90,
  Deg180 = 180,
  Deg270 = 270,
}

export type PdfRotation =
  | PdfRotationAngle.Deg0
  | PdfRotationAngle.Deg90
  | PdfRotationAngle.Deg180
  | PdfRotationAngle.Deg270;
