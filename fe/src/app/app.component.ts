import { Component, signal, ChangeDetectorRef, inject } from '@angular/core';
import { ApiService } from './api-service/api-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent {
  protected readonly title = signal('fe');

  private _apiService: ApiService = inject(ApiService);

  uploadedFileSrc: string = '';
  uploadedFileName: string = '';
  theme: 'dark' | 'light' = 'dark';

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  protected onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
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
    reader.onload = (e) => {
      this.uploadedFileSrc = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this._apiService.uploadPdf(file).subscribe({
      next: (response) => console.log('Upload successful:', response),
      error: (error) => console.error('Upload failed:', error),
    });
  }

  //TODO: Implement clearAllFields
  // clearAllFields(): void {

  // }
}
