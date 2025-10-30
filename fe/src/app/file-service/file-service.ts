import { inject, Injectable } from '@angular/core';

import { AddFormFieldState } from '../add-form-field-state/add-form-field-state';
import { ApiService, IUploadPdf } from '../api-service/api-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private _apiService: ApiService = inject(ApiService);
  private _addFormFieldState: AddFormFieldState = inject(AddFormFieldState);

  private uploadedFileNameSubject = new BehaviorSubject<string>('');
  private uploadedFileSrcSubject = new BehaviorSubject<string>('');
  private fields = new BehaviorSubject<HTMLInputElement[]>([]);

  uploadedFileName$ = this.uploadedFileNameSubject.asObservable();
  uploadedFileSrc$ = this.uploadedFileSrcSubject.asObservable();
  fields$ = this.fields.asObservable();

  private processFile(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragOver(event: DragEvent): void {
    this.processFile(event);
  }

  onDragLeave(event: DragEvent): void {
    this.processFile(event);
  }

  onDrop(event: DragEvent): void {
    this.processFile(event);
    const file: File | undefined = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this._addFormFieldState.setDefaultValue();
      this.handleFile(file);
    }
  }

  onUploadFile(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this._addFormFieldState.setDefaultValue();
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    this.uploadedFileNameSubject.next(file.name);
    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.uploadedFileSrcSubject.next(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    this._apiService.uploadPdf(file).subscribe({
      next: (response: IUploadPdf) => {
        console.log('Upload successful:', response);
      },
      error: (error: Error) => console.error('Upload failed:', error),
    });
  }
}
