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
  Rotation,
  RotationTypes,
} from 'pdf-lib';

export interface IGetFields {
  name: string;
  type: string;
}

export async function addPdfField(
  fileBuffer: Buffer,
  pageIndex: number,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
): Promise<Uint8Array> {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);
  const form: PDFForm = pdfDoc.getForm();
  const page: PDFPage = pdfDoc.getPage(pageIndex - 1);

  const datetime: number = new Date().valueOf();
  const textField: PDFTextField = form.createTextField(`newTextField_${datetime}`);
  textField.setText('Sample Text');

  let xPosition: number;
  let yPosition: number;

  switch (rotation) {
    case 0:
    default:
      xPosition = x * (page.getWidth() / width);
      yPosition = y * (page.getHeight() / height);
      break;
    case 90:
      xPosition = page.getWidth() - y * (page.getWidth() / height);
      yPosition = x * (page.getHeight() / width);
      break;
    case 180:
      xPosition = page.getWidth() - x * (page.getWidth() / width);
      yPosition = page.getHeight() - y * (page.getHeight() / height);
      break;
    case 270:
      xPosition = y * (page.getWidth() / height);
      yPosition = page.getHeight() - x * (page.getHeight() / width);
      break;
  }

  // const { xPosition, yPosition } = (() => {
  //   switch (rotation) {
  //     case 0:
  //     default:
  //       return {
  //         xPosition: x * (page.getWidth() / width),
  //         yPosition: y * (page.getHeight() / height),
  //       };
  //     case 90:
  //       return {
  //         xPosition: page.getWidth() - y * (page.getWidth() / height),
  //         yPosition: x * (page.getHeight() / width),
  //       };

  //     case 180:
  //       return {
  //         xPosition: page.getWidth() - x * (page.getWidth() / width),
  //         yPosition: page.getHeight() - y * (page.getHeight() / height),
  //       };

  //     case 270:
  //       return {
  //         xPosition: y * (page.getWidth() / height),
  //         yPosition: page.getHeight() - x * (page.getHeight() / width),
  //       };

  //   }
  // })();

  const newRotation: Rotation = {
    type: RotationTypes.Degrees,
    angle: rotation,
  };

  textField.addToPage(page, {
    x: xPosition,
    y: yPosition,
    width: 100,
    height: 25,
    textColor: rgb(0, 0, 0),
    backgroundColor: rgb(1, 1, 1),
    borderWidth: 0,
    rotate: newRotation,
  });

  const pdfBytes: Uint8Array = await pdfDoc.save();
  return pdfBytes;
}

export async function getPdfFields(fileBuffer: Buffer): Promise<IGetFields[]> {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);

  const form: PDFForm = pdfDoc.getForm();
  const fields: PDFField[] = form.getFields();

  return fields.map((field: PDFField) => {
    const type: string = field.constructor.name;
    return { name: field.getName(), type };
  });
}

export async function removeFieldsValues(fileBuffer: Buffer): Promise<Uint8Array> {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);
  const form: PDFForm = pdfDoc.getForm();

  form.getFields().forEach((field: PDFField) => clearFieldsValues(field));

  const pdfBytes: Uint8Array = await pdfDoc.save();
  return pdfBytes;
}

function clearFieldsValues(field: PDFField): void {
  switch (true) {
    case field instanceof PDFTextField:
      field.setText('');
      break;
    case field instanceof PDFCheckBox:
      field.uncheck();
      break;
    case field instanceof PDFDropdown:
      field.clear();
      break;
    case field instanceof PDFRadioGroup:
      field.clear();
      break;
    case field instanceof PDFOptionList:
      field.clear();
      break;
    default:
      console.error('Unsupported field type');
  }
}

export async function removeFieldByName(
  fileBuffer: Buffer,
  fieldName: string
): Promise<Uint8Array> {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);

  const form: PDFForm = pdfDoc.getForm();
  const field: PDFField | null = form.getField(fieldName);

  if (field) {
    clearFieldsValues(field);
    form.removeField(field);
  }

  const pdfBytes: Uint8Array = await pdfDoc.save();
  return pdfBytes;
}

export async function updateFieldSize(
  fileBuffer: Buffer,
  fieldName: string,
  canvasWidth: number,
  canvasHeight: number,
  width: number,
  height: number
): Promise<Uint8Array> {
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
          (p) =>
            p.ref.objectNumber === pageRef.objectNumber &&
            p.ref.generationNumber === pageRef.generationNumber
        );
      }

      if (page) {
        const { width: pageWidth, height: pageHeight } = page.getSize();
        const angle = page.getRotation().angle;

        const scaleX = pageWidth / canvasWidth;
        const scaleY = pageHeight / canvasHeight;

        const newWidth = width * scaleX;
        const newHeight = height * scaleY;

        const { x, y } = widget.getRectangle();
        widget.setRectangle({ x, y, width: newWidth, height: newHeight });
      }
    });
  }

  const pdfBytes: Uint8Array = await pdfDoc.save();
  return pdfBytes;
}
