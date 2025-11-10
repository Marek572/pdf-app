import { inject, Injectable } from '@angular/core';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfViewerService {
  private _ngxService: NgxExtendedPdfViewerService = inject(NgxExtendedPdfViewerService);
  private _processedPdfFields: BehaviorSubject<HTMLElement[]> = new BehaviorSubject<HTMLElement[]>(
    [],
  );
  processedPdfFields$: Observable<HTMLElement[]> = this._processedPdfFields.asObservable();

  onAnnotationLayerRendered(): void {
    const allPdfFields: NodeListOf<HTMLElement> =
      document.querySelectorAll('.textWidgetAnnotation');

    if (allPdfFields.length === 0) return;

    allPdfFields.forEach((field) => {
      if (!field.classList.contains('processed-pdf-field')) {
        this._processedPdfFields.next([...this._processedPdfFields.getValue(), field]);
        field.classList.add('processed-pdf-field');
      }
    });

    this._processedPdfFields.getValue().forEach((processedField) => {
      if (!processedField.classList.contains('with-event-listener')) {
        processedField.classList.add('with-event-listener');
      }

      //TODO:
      // processedField.addEventListener('click', () => {
      //   console.log('PDF Field clicked:', processedField);
      // });
    });
  }

  async getPdfFieldsAsBlob(): Promise<Blob> {
    const blob: Blob | undefined = await this._ngxService.getCurrentDocumentAsBlob();

    if (!blob) {
      throw new Error('Failed to get PDF blob');
    }

    return blob;
  }
}
