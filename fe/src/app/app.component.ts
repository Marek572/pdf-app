import { Component, HostListener, inject, OnInit, signal } from '@angular/core';

import { filter, Subject, switchMap, takeUntil } from 'rxjs';

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
  private _fileService: FileService = inject(FileService);

  uploadedFileSrc!: string;
  fields!: HTMLInputElement[];

  ngOnInit(): void {
    this._fileService.uploadedFileSrc$
      .pipe(takeUntil(this._destroy$))
      .subscribe((src: string) => (this.uploadedFileSrc = src));

    this._editFormFieldsState.toggleEditFormFields$
      .pipe(
        takeUntil(this._destroy$),

        filter((isEditing) => !isEditing),
        filter(() => !!this.uploadedFileSrc),
        switchMap(() => this._pdfViewerService.getPdfFieldsAsBlob()),
        switchMap((blob) => this._apiService.updatePdf(blob)),
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

  onDragOver(event: DragEvent): void {
    this._fileService.onDragOver(event);
  }

  onDragLeave(event: DragEvent): void {
    this._fileService.onDragLeave(event);
  }

  onDrop(event: DragEvent): void {
    this._fileService.onDrop(event);
  }

  onFileSelected(event: Event): void {
    this._fileService.onUploadFile(event);
  }
}
