import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { AddFieldRequest, FieldSizeChangeRequest } from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _http: HttpClient = inject(HttpClient);

  private readonly _baseUrl: string = environment.apiUrl;
  private readonly _controllerPath: string = 'pdf';

  uploadPdf(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this._post('upload', formData, 'blob');
  }

  addPdfField(params: AddFieldRequest): Observable<Blob> {
    return this._post('fields', params, 'blob');
  }

  updatePdfFields(blob: Blob): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', blob);

    return this._put('fields', formData, 'blob');
  }

  removeFieldsValues(): Observable<Blob> {
    return this._delete('fields/values', 'blob');
  }

  removeField(fieldName: string): Observable<Blob> {
    return this._delete(`fields/${encodeURIComponent(fieldName)}`, 'blob');
  }

  updateFieldSize(fieldName: string, params: FieldSizeChangeRequest): Observable<Blob> {
    return this._put(`fields/${encodeURIComponent(fieldName)}`, params, 'blob');
  }

  private _post<T>(endpoint: string, body: any, responseType?: 'blob'): Observable<T> {
    const url: string = `${this._baseUrl}/${this._controllerPath}/${endpoint}`;

    const options = responseType ? { responseType } : {};
    return this._http.post(url, body, options as any) as Observable<T>;
  }

  private _put<T>(endpoint: string, body: any, responseType?: 'blob'): Observable<T> {
    const url: string = `${this._baseUrl}/${this._controllerPath}/${endpoint}`;

    const options = responseType ? { responseType } : {};
    return this._http.put(url, body, options as any) as Observable<T>;
  }

  private _delete<T>(endpoint: string, responseType?: 'blob'): Observable<T> {
    const url: string = `${this._baseUrl}/${this._controllerPath}/${endpoint}`;

    const options = responseType ? { responseType } : {};
    return this._http.delete(url, options as any) as Observable<T>;
  }
}
