import fs from "fs";
import { PDFDocument } from "pdf-lib";

export async function getPdfFields(fileBuffer: Buffer) {
  const pdfDoc: PDFDocument = await PDFDocument.load(fileBuffer);

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  return fields.map((field) => {
    const type = field.constructor.name;
    return { name: field.getName(), type };
  });
}
