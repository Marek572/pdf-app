import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { AddFormFieldState } from '../add-form-field-state/add-form-field-state';
import { ApiService } from '../api-service/api-service';
import { UploadPdfResponse } from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private _destory$ = new Subject<void>();
  private _apiService: ApiService = inject(ApiService);
  private _addFormFieldState: AddFormFieldState = inject(AddFormFieldState);

  private _uploadedFileNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _uploadedFileSrcSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _fields: BehaviorSubject<HTMLInputElement[]> = new BehaviorSubject<HTMLInputElement[]>(
    [],
  );

  uploadedFileName$: Observable<string> = this._uploadedFileNameSubject.asObservable();
  uploadedFileSrc$: Observable<string> = this._uploadedFileSrcSubject.asObservable();
  fields$: Observable<HTMLInputElement[]> = this._fields.asObservable();

  onDragOver(event: DragEvent): void {
    this._processFile(event);
  }

  onDragLeave(event: DragEvent): void {
    this._processFile(event);
  }

  onDrop(event: DragEvent): void {
    this._processFile(event);
    const file: File | undefined = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this._addFormFieldState.setDefaultValue();
      this._handleFile(file);
    }
  }

  onUploadFile(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this._addFormFieldState.setDefaultValue();
      this._handleFile(file);
    }
  }

  private _processFile(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private _handleFile(file: File): void {
    this._uploadedFileNameSubject.next(file.name);
    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this._uploadedFileSrcSubject.next(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    this._apiService
      .uploadPdf(file)
      .pipe(takeUntil(this._destory$))
      .subscribe({
        next: (response: UploadPdfResponse) => {
          console.log('Upload successful:', response);
        },
        error: (error: Error) => console.error('Upload failed:', error),
      });
  }
}
