import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfViewerService {
  private processedPdfFields = new BehaviorSubject<HTMLElement[]>([]);
  processedPdfFields$ = this.processedPdfFields.asObservable();

  onAnnotationLayerRendered(): void {
    const allPdfFields: NodeListOf<HTMLElement> =
      document.querySelectorAll('.textWidgetAnnotation');

    if (allPdfFields.length === 0) return;

    allPdfFields.forEach((field) => {
      if (!field.classList.contains('processed-pdf-field')) {
        this.processedPdfFields.next([...this.processedPdfFields.getValue(), field]);
        field.classList.add('processed-pdf-field');
      }
    });

    this.processedPdfFields.getValue().forEach((processedField) => {
      if (!processedField.classList.contains('with-event-listener')) {
        processedField.classList.add('with-event-listener');
        //TODO:
        processedField.addEventListener('click', () => {
          console.log('Field value changed:', {
            name: processedField.getAttribute('name'),
            value: (processedField as HTMLInputElement).value,
          });
        });
      }
    });

    console.log();
  }
}
