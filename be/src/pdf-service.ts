import fs from 'fs';
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFField,
  PDFOptionList,
  PDFRadioGroup,
  PDFTextField,
} from 'pdf-lib';

export async function getPdfFields(fileBuffer: Buffer) {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  return fields.map((field: PDFField) => {
    const type: string = field.constructor.name;
    return { name: field.getName(), type };
  });
}

export async function removeFieldsValues(fileBuffer: Buffer) {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);

  const form = pdfDoc.getForm();
  form.getFields().forEach((field: PDFField) => {
    const type: string = field.constructor.name;
    if (field instanceof PDFTextField) {
      field.setText('');
    } else if (field instanceof PDFCheckBox) {
      field.uncheck();
    } else if (field instanceof PDFDropdown) {
      field.clear();
    } else if (field instanceof PDFRadioGroup) {
      field.clear();
    } else if (field instanceof PDFOptionList) {
      field.clear();
    }
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
