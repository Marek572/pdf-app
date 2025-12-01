import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';

import { filter, skip, Subject, switchMap, takeUntil } from 'rxjs';

import { AddFormFieldState } from './services/add-form-field-state/add-form-field-state';
import { ApiService } from './services/api-service/api-service';
import { EditFormFieldsState } from './services/edit-form-fields-state/edit-form-fields-state';
import { FileService } from './services/file-service/file-service';
import { PdfViewerService } from './services/pdf-viewer-service/pdf-viewer-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent implements OnInit {
  protected readonly title = signal('fe');

  private _destroy$ = new Subject<void>();
  private _apiService: ApiService = inject(ApiService);
  private _addFormFieldState: AddFormFieldState = inject(AddFormFieldState);
  private _editFormFieldsState: EditFormFieldsState = inject(EditFormFieldsState);
  private _pdfViewerService: PdfViewerService = inject(PdfViewerService);
  protected _fileService: FileService = inject(FileService);

  uploadedFileSrc!: string;
  fields!: HTMLInputElement[];

  ngOnInit(): void {
    this._fileService.uploadedFileSrc$
      .pipe(takeUntil(this._destroy$))
      .subscribe((src: string) => (this.uploadedFileSrc = src));

    this._editFormFieldsState.toggleEditFormFields$
      .pipe(
        takeUntil(this._destroy$),
        skip(1), // Pomiń wartość początkową
        filter((isEditing) => !isEditing), // Reaguj tylko gdy przełączamy na FALSE (wyłączamy edycję)
        // Używamy withLatestFrom lub po prostu sprawdzamy wartość wewnątrz,
        // ale tutaj filter wystarczy, jeśli uploadedFileSrc jest aktualizowane synchronicznie
        filter(() => !!this.uploadedFileSrc),
        switchMap(() => this._pdfViewerService.getPdfFieldsAsBlob()), // Pobierz Blob
        switchMap((blob) => this._apiService.updatePdfFields(blob)), // Wyślij do API
      )
      .subscribe({
        next: (response: Blob) => this._fileService.updateFileFromBlob(response),
        error: (error) => console.error('Update PDF fields failed:', error),
      });

    this._fileService.fields$
      .pipe(takeUntil(this._destroy$))
      .subscribe((fields: HTMLInputElement[]) => (this.fields = fields));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this._addFormFieldState.toggleAddFormField$) {
      this._addFormFieldState.setDefaultValue();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
