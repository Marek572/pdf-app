import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';

export interface IUploadPdf {
  fileName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _http: HttpClient = inject(HttpClient);

  private _controllerPath = 'pdf';

  uploadPdf(file: File): Observable<IUploadPdf> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this._http.post<IUploadPdf>(url, formData);
  }

  addPdfField(fileName: string, pageIndex: number, x: number, y: number): Observable<Blob> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/addField`;

    const fields: { [key: string]: string } = {
      fileName,
      pageIndex: pageIndex.toString(),
      x: x.toString(),
      y: y.toString(),
    };
    const formData: FormData = new FormData();

    for (const key in fields) {
      formData.append(key, fields[key]);
    }

    return this._http.put(url, formData, { responseType: 'blob' });
  }

  //FIXME: if type of Observable<Blob> erorr is handled as blob and not shown
  removeFieldsValues(fileName: string): Observable<Blob> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/${fileName}`;
    return this._http.put(url, {}, { responseType: 'blob' });
  }
}
