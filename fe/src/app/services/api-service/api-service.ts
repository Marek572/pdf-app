import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { AddFieldRequest, FieldChangeRequest } from '../../models/api.models';

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

    return this._request('post', 'file', formData, 'blob');
  }

  updatePdf(blob: Blob): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', blob);

    return this._request('put', 'file', formData, 'blob');
  }

  addPdfField(params: AddFieldRequest): Observable<Blob> {
    return this._request('post', 'fields', params, 'blob');
  }

  removeFieldsValues(): Observable<Blob> {
    return this._request('delete', 'fields/values', null, 'blob');
  }

  removeField(fieldName: string): Observable<Blob> {
    const fieldNameEncoded = encodeURIComponent(fieldName);

    return this._request('delete', `fields/${fieldNameEncoded}`, null, 'blob');
  }

  updateFieldSize(fieldName: string, params: FieldChangeRequest): Observable<Blob> {
    const fieldNameEncoded = encodeURIComponent(fieldName);

    return this._request('patch', `fields/${fieldNameEncoded}`, params, 'blob');
  }

  private _request<T>(
    method: string,
    endpoint: string,
    body: any = null,
    responseType?: 'blob',
  ): Observable<T> {
    const url: string = `${this._baseUrl}/${this._controllerPath}/${endpoint}`;
    const optionsBody = body ? { body } : {};
    const optionsResponseType = responseType ? { responseType } : {};
    const options = { ...optionsBody, ...optionsResponseType };

    return this._http.request<T>(method, url, options as any) as Observable<T>;
  }
}
