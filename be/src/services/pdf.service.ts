import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFField,
  PDFForm,
  PDFOptionList,
  PDFPage,
  PDFRadioGroup,
  PDFTextField,
  rgb,
} from 'pdf-lib';

export async function addPdfField(fileBuffer: Buffer, pageIndex: number, x: number, y: number) {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);
  const form: PDFForm = pdfDoc.getForm();
  const page: PDFPage = pdfDoc.getPage(pageIndex - 1);
  console.log(`position (${x}, ${y})`);
  console.log(`page size (${page.getWidth()}, ${page.getHeight()})`);

  const datetime: number = new Date().valueOf();
  const textField: PDFTextField = form.createTextField(`newTextField_${datetime}`);
  textField.setText('Sample Text');
  textField.addToPage(page, {
    x: x / 1.33,
    y: y / 1.33,
    width: 100,
    height: 25,
    textColor: rgb(0, 0, 0),
    backgroundColor: rgb(1, 1, 1),
    borderWidth: 0,
  });

  const pdfBytes: Uint8Array = await pdfDoc.save();
  return pdfBytes;
}

export async function getPdfFields(fileBuffer: Buffer) {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);

  const form: PDFForm = pdfDoc.getForm();
  const fields: PDFField[] = form.getFields();

  return fields.map((field: PDFField) => {
    const type: string = field.constructor.name;
    return { name: field.getName(), type };
  });
}

export async function removeFieldsValues(fileBuffer: Buffer) {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);

  const form: PDFForm = pdfDoc.getForm();
  form.getFields().forEach((field: PDFField) => {
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

  const pdfBytes: Uint8Array = await pdfDoc.save();
  return pdfBytes;
}
