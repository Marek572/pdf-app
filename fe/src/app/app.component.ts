import { Component, inject, signal } from '@angular/core';
import { ApiService, UploadResponse } from './api-service/api-service';
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
      this.handleFile(file);
    }
  }

  protected onUploadFile(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (file && file.type === 'application/pdf') {
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
      next: (response: UploadResponse) => {
        console.log('Upload successful:', response);
      },
      error: (error: Error) => console.error('Upload failed:', error),
    });
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

  addFormField(): void {
    //TODO: implement adding form field
  }
}
