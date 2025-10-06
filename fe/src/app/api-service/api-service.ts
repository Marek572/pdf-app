import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _http: HttpClient = inject(HttpClient);

  private _controllerPath = 'pdf';

  // TODO: Implement API service methods: CRUD
  //UPLOAD PDF

  uploadPdf(file: File) {
    const url = `${environment.apiUrl}/${this._controllerPath}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this._http.post(url, formData);
  }
}
