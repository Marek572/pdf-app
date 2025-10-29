import { Component, HostListener, inject, signal } from '@angular/core';
import { ApiService, IUploadPdf } from './api-service/api-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent {
  protected readonly title = signal('fe');

  private _apiService: ApiService = inject(ApiService);

  uploadedFileSrc: string | null = null;

  uploadedFileName: string = '';
  toggleAddFormField: boolean = false;
  currentPage: number = 1;

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file: File | undefined = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.toggleAddFormField = false;
      this.handleFile(file);
    }
  }

  protected onUploadFile(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.toggleAddFormField = false;
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    this.uploadedFileName = file.name;
    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.uploadedFileSrc = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this._apiService.uploadPdf(file).subscribe({
      next: (response: IUploadPdf) => {
        console.log('Upload successful:', response);
      },
      error: (error: Error) => console.error('Upload failed:', error),
    });
  }

  toggleAddFormFieldClick(): void {
    this.toggleAddFormField = !this.toggleAddFormField;
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.toggleAddFormField) {
      this.toggleAddFormField = false;
      event.preventDefault();
      event.stopPropagation();
    }
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
            this.toggleAddFormField = false;
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
