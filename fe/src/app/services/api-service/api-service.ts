import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { AddFieldRequest, UploadPdfResponse } from '../../models/api.models';

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

    const fields: { [key: string]: string } = {
      pageIndex: params.pageIndex.toString(),
      x: params.x.toString(),
      y: params.y.toString(),
      width: params.width.toString(),
      height: params.height.toString(),
      rotation: params.rotation.toString(),
    };
    const formData: FormData = new FormData();

    for (const key in fields) {
      formData.append(key, fields[key]);
    }

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
}
