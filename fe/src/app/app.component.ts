import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ApiService } from './api-service/api-service';
import { AddFormFieldState } from './add-form-field-state/add-form-field-state';
import { FileService } from './file-service/file-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent implements OnInit {
  protected readonly title = signal('fe');

  private _apiService: ApiService = inject(ApiService);
  private _addFormFieldState: AddFormFieldState = inject(AddFormFieldState);
  public fileService: FileService = inject(FileService);

  uploadedFileSrc!: string;
  uploadedFileName!: string;
  toggleAddFormField!: boolean;
  currentPage: number = 1;
  fields!: HTMLInputElement[];

  ngOnInit(): void {
    this._addFormFieldState.toggleAddFormField$.subscribe(
      (value: boolean) => (this.toggleAddFormField = value),
    );

    this.fileService.uploadedFileSrc$.subscribe((src: string) => (this.uploadedFileSrc = src));
    this.fileService.uploadedFileName$.subscribe((name: string) => (this.uploadedFileName = name));
    this.fileService.fields$.subscribe((fields: HTMLInputElement[]) => (this.fields = fields));
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

  addFormField(event: MouseEvent): void {
    const target: HTMLElement = event.target as HTMLElement;

    if (!this.toggleAddFormField) return;

    const canvas = target.parentElement?.querySelector('canvas');

    if (this.toggleAddFormField && canvas) {
      const rect = canvas.getBoundingClientRect();
      console.log('Coordinates:', { x: event.clientX - rect.left, y: rect.bottom - event.clientY });

      this._apiService
        .addPdfField(
          this.uploadedFileName,
          this.currentPage,
          event.clientX - rect.left,
          rect.bottom - event.clientY,
        )
        .subscribe({
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
    if (!this.uploadedFileName) {
      return console.error('No file has been uploaded yet.');
    }

    this._apiService.removeFieldsValues(this.uploadedFileName).subscribe({
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
