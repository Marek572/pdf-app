import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import {
  AddFieldRequest,
  UploadPdfResponse,
  PageSize,
  FieldSizeChangeRequest,
} from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _http: HttpClient = inject(HttpClient);

  private readonly _controllerPath: string = 'pdf';

  uploadPdf(file: File): Observable<UploadPdfResponse> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this._http.post<UploadPdfResponse>(url, formData);
  }

  addPdfField(params: AddFieldRequest): Observable<Blob> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/addField`;

    const fields: AddFieldRequest = {
      pageIndex: params.pageIndex,
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
      rotation: params.rotation,
    };
    const formData: FormData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    return this._http.put(url, formData, { responseType: 'blob' });
  }

  updatePdfFields(blob: Blob): Observable<Blob> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/updateFields`;
    const formData: FormData = new FormData();
    formData.append('file', blob);

    return this._http.put(url, formData, { responseType: 'blob' });
  }

  removeFieldsValues(): Observable<Blob> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/clearFields`;
    return this._http.put(url, {}, { responseType: 'blob' });
  }

  removeField(fieldName: string): Observable<Blob> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/removeField/${fieldName}`;
    return this._http.delete(url, { responseType: 'blob' });
  }

  updateFieldSize(
    fieldName: string,
    pageSize: PageSize,
    width: number,
    height: number,
  ): Observable<Blob> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/updateFieldSize/${fieldName}`;

    const formData: FormData = new FormData();

    const fieldSizeChange: FieldSizeChangeRequest = {
      pageWidth: pageSize.width,
      pageHeight: pageSize.height,
      width: width,
      height: height,
    };

    Object.entries(fieldSizeChange).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    return this._http.put(url, formData, { responseType: 'blob' });
  }
}
