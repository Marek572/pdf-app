import { ElementRef, inject, Injectable, Injector } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { ApiService } from '../api-service/api-service';
import { FileService } from '../file-service/file-service';
import { PageSize } from '../../models/api.models';
import { PdfViewerService } from '../pdf-viewer-service/pdf-viewer-service';
import { PdfRotation } from '../../models/types';

export interface FieldSettingsState {
  isOpen: boolean;
  field: HTMLElement | null;
  trigger: FieldTrigger;
  preventClose: boolean;
  pageSize: { width: number; height: number };
}

type FieldTrigger = CdkOverlayOrigin | ElementRef | HTMLElement | null;

@Injectable({
  providedIn: 'root',
})
export class FieldSettings {
  private _injector = inject(Injector);
  private _apiService = inject(ApiService);
  private _fileService = inject(FileService);
  private _fieldSettingsState: BehaviorSubject<FieldSettingsState> =
    new BehaviorSubject<FieldSettingsState>({
      isOpen: false,
      field: null,
      trigger: null,
      preventClose: false,
      pageSize: { width: 0, height: 0 },
    });

  fieldSettings$: Observable<FieldSettingsState> = this._fieldSettingsState.asObservable();

  openPanel(field: any, trigger: FieldTrigger): void {
    const currentState = this._fieldSettingsState.value;

    if (currentState.isOpen && currentState.trigger === trigger) {
      this.closePanel();
      return;
    }

    const pageContainer = field.closest('.page') as HTMLElement | null;
    const canvas = pageContainer?.querySelector('canvas') as HTMLCanvasElement | null;

    let pageSize = { width: 0, height: 0 };

    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      pageSize = { width: rect.width, height: rect.height };
    }

    this._fieldSettingsState.next({
      isOpen: true,
      field,
      trigger,
      pageSize,
      preventClose: false,
    });
  }

  setPreventClose(prevent: boolean): void {
    const currentState = this._fieldSettingsState.value;
    this._fieldSettingsState.next({
      ...currentState,
      preventClose: prevent,
    });
  }

  closePanel(force: boolean = false): void {
    const currentState = this._fieldSettingsState.value;

    if (!force && currentState.preventClose) {
      return;
    }

    this._fieldSettingsState.next({
      isOpen: false,
      field: null,
      trigger: null,
      preventClose: false,
      pageSize: { width: 0, height: 0 },
    });
  }

  removeField(): void {
    const currentState: FieldSettingsState = this._fieldSettingsState.value;
    if (currentState.field) {
      const field: Element | null = currentState.field.firstElementChild;

      if (!field) {
        console.error('No field found inside the selected element');
        return;
      }
      const fieldName: string = field.attributes.getNamedItem('name')?.value || '';

      this._apiService
        .removeField(fieldName)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            field.parentElement?.remove();
            this.closePanel(true);
            this._fileService.updateFileFromBlob(data);
          },
          error: (err) => {
            console.error('Error removing field:', err);
          },
        });
    }
  }

  saveChanges(fieldWidth: number, fieldHeight: number): void {
    const currentState = this._fieldSettingsState.value;
    const rotation: PdfRotation = this._pdfViewerService.getRotation();

    if (currentState.field) {
      const field: Element | null = currentState.field.firstElementChild;

      if (!field) {
        console.error('No field found inside the selected element');
        return;
      }

      const isHorizontal = rotation === 90 || rotation === 270;

      const offsetWidth = isHorizontal
        ? currentState.field?.offsetHeight
        : currentState.field?.offsetWidth;
      const offsetHeight = isHorizontal
        ? currentState.field?.offsetWidth
        : currentState.field?.offsetHeight;

      const { width, height } = currentState.pageSize;

      const pageSize: PageSize = isHorizontal
        ? { width: height, height: width }
        : { width, height };

      if (offsetWidth !== fieldWidth || offsetHeight !== fieldHeight) {
        const fieldName: string = field.attributes.getNamedItem('name')?.value || '';
        const payloadWidth = isHorizontal ? fieldHeight : fieldWidth;
        const payloadHeight = isHorizontal ? fieldWidth : fieldHeight;

        this._apiService
          .updateFieldSize(fieldName, pageSize, payloadWidth, payloadHeight)
          .pipe(take(1))
          .subscribe({
            next: (data) => {
              this.closePanel(true);
              this._fileService.updateFileFromBlob(data);
            },
            error: (err) => {
              console.error('Error updating field:', err);
            },
          });
      }
    }
  }

  private get _pdfViewerService(): PdfViewerService {
    return this._injector.get(PdfViewerService);
  }
}
