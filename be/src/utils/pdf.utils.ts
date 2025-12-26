import {
  PDFCheckBox,
  PDFDropdown,
  PDFField,
  PDFForm,
  PDFOptionList,
  PDFPage,
  PDFRadioGroup,
  PDFTextField,
} from 'pdf-lib';
import { GetPdfFields } from '../models/interfaces';

export function calculatePdfCoordinates(
  page: PDFPage,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number,
  rotation: number
): { x: number; y: number } {
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  // Skalowanie
  const scaleX = pageWidth / canvasWidth;
  const scaleY = pageHeight / canvasHeight;

  switch (rotation) {
    case 90:
      return {
        x: pageWidth - y * (pageWidth / canvasHeight),
        y: x * (pageHeight / canvasWidth),
      };
    case 180:
      return {
        x: pageWidth - x * scaleX,
        y: pageHeight - y * scaleY,
      };
    case 270:
      return {
        x: y * (pageWidth / canvasHeight),
        y: pageHeight - x * (pageHeight / canvasWidth),
      };
    case 0:
    default:
      return {
        x: x * scaleX,
        y: y * scaleY,
      };
  }
}

function isClearableField(field: PDFField): field is PDFDropdown | PDFRadioGroup | PDFOptionList {
  return (
    field instanceof PDFDropdown || field instanceof PDFRadioGroup || field instanceof PDFOptionList
  );
}

export function clearFieldsValue(field: PDFField): void {
  if (field instanceof PDFTextField) {
    field.setText('');
  } else if (field instanceof PDFCheckBox) {
    field.uncheck();
  } else if (isClearableField(field)) {
    field.clear();
  } else {
    console.error('Unsupported field type', field);
  }
}

export function mapFormFields(form: PDFForm): GetPdfFields[] {
  const fields = form.getFields();
  return fields.map((field) => ({
    name: field.getName(),
    type: field.constructor.name,
  }));
}
