import { inject, Injectable } from '@angular/core';

import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { BehaviorSubject, Observable } from 'rxjs';

import { FieldSettings } from '../field-settings/field-settings';
import { PdfRotation } from '../../models/types';

@Injectable({
  providedIn: 'root',
})
export class PdfViewerService {
  private _ngxService: NgxExtendedPdfViewerService = inject(NgxExtendedPdfViewerService);
  private _fieldSettings = inject(FieldSettings);
  private _processedPdfFields: BehaviorSubject<HTMLElement[]> = new BehaviorSubject<HTMLElement[]>(
    [],
  );
  private _rotation: BehaviorSubject<PdfRotation> = new BehaviorSubject<PdfRotation>(0);

  processedPdfFields$: Observable<HTMLElement[]> = this._processedPdfFields.asObservable();
  rotation$: Observable<PdfRotation> = this._rotation.asObservable();

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
  }

  addClickListenersToPdfFields(): void {
    this._processedPdfFields.getValue().forEach((processedField) => {
      if (!processedField.classList.contains('with-event-listener')) {
        processedField.classList.add('with-event-listener');

        processedField.addEventListener('click', (event) => {
          event.stopPropagation();
          this._fieldSettings.openPanel(processedField, processedField);
        });
      }
    });
  }

  setRotation(rotation: PdfRotation): void {
    this._rotation.next(rotation);
  }

  getRotation(): PdfRotation {
    return this._rotation.getValue();
  }

  async getPdfFieldsAsBlob(): Promise<Blob> {
    const blob: Blob | undefined = await this._ngxService.getCurrentDocumentAsBlob();

    if (!blob) {
      throw new Error('Failed to get PDF blob');
    }

    return blob;
  }
}
