export class PdfStorageService {
  private currentPdf: Buffer | null = null;
  private originalPdf: Buffer | null = null;
  private fileName: string | null = null;

  uploadPdf(fileBuffer: Buffer, fileName: string): void {
    this.originalPdf = fileBuffer;
    this.currentPdf = fileBuffer;
    this.fileName = fileName;
  }

  updateCurrentPdf(fileBuffer: Buffer): void {
    if (!this.originalPdf) {
      throw new Error('No PDF file uploaded yet');
    }
    this.currentPdf = fileBuffer;
  }

  getCurrentPdf(): Buffer {
    if (!this.currentPdf) {
      throw new Error('No PDF file uploaded yet');
    }
    return this.currentPdf;
  }

  getOriginalPdf(): Buffer {
    if (!this.originalPdf) {
      throw new Error('No PDF file uploaded yet');
    }
    return this.originalPdf;
  }

  getFileName(): string {
    if (!this.fileName) {
      throw new Error('No PDF file uploaded yet');
    }
    return this.fileName;
  }

  hasPdf(): boolean {
    return this.currentPdf !== null;
  }

  clear(): void {
    this.currentPdf = null;
    this.originalPdf = null;
    this.fileName = null;
  }
}
