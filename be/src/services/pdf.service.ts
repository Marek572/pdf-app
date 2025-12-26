import {
  PDFDocument,
  PDFField,
  PDFForm,
  PDFPage,
  PDFTextField,
  rgb,
  Rotation,
  RotationTypes,
} from 'pdf-lib';

import { GetPdfFields, NewPdfFieldParams, UpdatePdfFieldSizeParams } from '../models/interfaces';
import { calculatePdfCoordinates, clearFieldsValue, mapFormFields } from '../utils/pdf.utils';

const DEFAULT_FIELD_WIDTH = 100;
const DEFAULT_FIELD_HEIGHT = 25;

export async function addPdfField(
  fileBuffer: Buffer,
  newFieldParams: NewPdfFieldParams
): Promise<Uint8Array> {
  const { pageIndex, x, y, canvasWidth, canvasHeight, rotation } = newFieldParams;

  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);
  const form: PDFForm = pdfDoc.getForm();
  const page: PDFPage = pdfDoc.getPage(pageIndex - 1);

  const datetime: number = new Date().valueOf();
  const textField: PDFTextField = form.createTextField(`newTextField_${datetime}`);
  textField.setText('Sample Text');

  const { x: xPosition, y: yPosition } = calculatePdfCoordinates(
    page,
    x,
    y,
    canvasWidth,
    canvasHeight,
    rotation
  );

  const newRotation: Rotation = {
    type: RotationTypes.Degrees,
    angle: rotation,
  };

  textField.addToPage(page, {
    x: xPosition,
    y: yPosition,
    width: DEFAULT_FIELD_WIDTH,
    height: DEFAULT_FIELD_HEIGHT,
    textColor: rgb(0, 0, 0),
    backgroundColor: rgb(1, 1, 1),
    borderWidth: 0,
    rotate: newRotation,
  });

  return await pdfDoc.save();
}

export async function getPdfFields(fileBuffer: Buffer): Promise<GetPdfFields[]> {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);
  const form: PDFForm = pdfDoc.getForm();

  return mapFormFields(form);
}

export async function removeFieldsValues(fileBuffer: Buffer): Promise<Uint8Array> {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);
  const form: PDFForm = pdfDoc.getForm();

  form.getFields().forEach((field: PDFField) => clearFieldsValue(field));

  return await pdfDoc.save();
}

export async function removeFieldByName(
  fileBuffer: Buffer,
  fieldName: string
): Promise<Uint8Array> {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);
  const form: PDFForm = pdfDoc.getForm();
  const field: PDFField | null = form.getField(fieldName);

  if (field) {
    clearFieldsValue(field);
    form.removeField(field);
  }

  return await pdfDoc.save();
}

export async function updateFieldSize(
  fileBuffer: Buffer,
  fieldName: string,
  updatedFieldParams: UpdatePdfFieldSizeParams
): Promise<Uint8Array> {
  const { canvasWidth, canvasHeight, width, height } = updatedFieldParams;

  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);

  const form: PDFForm = pdfDoc.getForm();
  const field: PDFField | null = form.getField(fieldName);

  if (field) {
    const widgets = field.acroField.getWidgets();
    const pages = pdfDoc.getPages();

    widgets.forEach((widget) => {
      const pageRef = widget.P();
      let page: PDFPage | undefined;

      if (pageRef) {
        page = pages.find(
          (page) =>
            page.ref.objectNumber === pageRef.objectNumber &&
            page.ref.generationNumber === pageRef.generationNumber
        );
      }

      if (page) {
        const { width: pageWidth, height: pageHeight } = page.getSize();

        const scaleX = pageWidth / canvasWidth;
        const scaleY = pageHeight / canvasHeight;

        const newWidth = width * scaleX;
        const newHeight = height * scaleY;

        const { x, y } = widget.getRectangle();
        widget.setRectangle({ x, y, width: newWidth, height: newHeight });
      }
    });
  }

  return await pdfDoc.save();
}
