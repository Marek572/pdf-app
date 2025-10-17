import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';

export interface UploadResponse {
  fileName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _http: HttpClient = inject(HttpClient);

  private _controllerPath = 'pdf';

  uploadPdf(file: File): Observable<UploadResponse> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this._http.post<UploadResponse>(url, formData);
  }

  //FIXME: if type of Observable<Blob> erorr is handled as blob and not shown
  removeFieldsValues(filename: string): Observable<Blob> {
    const url: string = `${environment.apiUrl}/${this._controllerPath}/${filename}`;
    return this._http.put(url, {}, { responseType: 'blob' });
  }
}
