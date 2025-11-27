import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

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
  protected fileService: FileService = inject(FileService);

  uploadedFileSrc!: string;
  uploadedFileName!: string;
  toggleAddFormField!: boolean;
  toggleEditFormFields!: boolean;
  fields!: HTMLInputElement[];
  currentPage: number = 1;

  ngOnInit(): void {
    this._addFormFieldState.toggleAddFormField$
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: boolean) => (this.toggleAddFormField = value));
    this._editFormFieldsState.toggleEditFormFields$
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: boolean) => (this.toggleEditFormFields = value));
    this.fileService.uploadedFileSrc$
      .pipe(takeUntil(this._destroy$))
      .subscribe((src: string) => (this.uploadedFileSrc = src));
    this.fileService.uploadedFileName$
      .pipe(takeUntil(this._destroy$))
      .subscribe((name: string) => (this.uploadedFileName = name));
    this.fileService.fields$
      .pipe(takeUntil(this._destroy$))
      .subscribe((fields: HTMLInputElement[]) => (this.fields = fields));
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.toggleAddFormField) {
      this._addFormFieldState.setDefaultValue();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  toggleAddFormFieldClick(): void {
    this._addFormFieldState.toggleValue();
  }

  toggleEditFormFieldsClick(): void {
    this._editFormFieldsState.toggleValue();

    if (!this.toggleEditFormFields) {
      const pdfFieldsBlob: Promise<Blob> = this._pdfViewerService.getPdfFieldsAsBlob();

      pdfFieldsBlob.then((blob: Blob) => {
        this._apiService.updatePdfFields(blob).subscribe({
          next: (response: Blob) => {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
              this.uploadedFileSrc = e.target?.result as string;
            };
            reader.readAsDataURL(response);
          },
          error: (error: Error) => console.error('Update PDF fields failed:', error),
        });
      });
    }
  }

  addFormField(event: MouseEvent): void {
    if (!this.uploadedFileName) return console.error('No file has been uploaded yet.');

    const target: HTMLElement = event.target as HTMLElement;

    console.log(this.toggleAddFormField, target.classList.contains('textLayer'));

    if (this.toggleAddFormField && target.classList.contains('textLayer')) {
      const canvas = target.parentElement!.querySelector('canvas');
      const rect = canvas!.getBoundingClientRect();

      const params = {
        pageIndex: this.currentPage,
        x: event.clientX - rect.left,
        y: rect.bottom - event.clientY,
        width: rect.width,
        height: rect.height,
      };

      this._apiService.addPdfField(params).subscribe({
        next: (response: Blob) => {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            this.uploadedFileSrc = e.target?.result as string;
          };
          reader.readAsDataURL(response);
          this._addFormFieldState.setDefaultValue();
        },
        error: (error: Error) => console.error('Add form field failed:', error),
      });
    }
  }

  clearAllFields(): void {
    if (!this.uploadedFileName) return console.error('No file has been uploaded yet.');

    this._apiService.removeFieldsValues().subscribe({
      next: (response: Blob) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.uploadedFileSrc = e.target?.result as string;
        };
        reader.readAsDataURL(response);
      },
      error: (error: HttpErrorResponse) => console.error('Failed to clear fields:', error),
    });
  }
}
