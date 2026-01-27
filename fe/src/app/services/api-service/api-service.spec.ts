import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ApiService } from './api-service';
import { environment } from '../../../environments/environment.development';

describe('PdfApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Upload file request', () => {
    it('method should be POST', () => {
      const testFile = new File([], 'test.pdf', { type: 'application/pdf' });
      service.uploadPdf(testFile).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
      expect(req.request.method).toBe('POST');
    });
    it('should send the file in FormData', () => {
      const testFile = new File([], 'test.pdf', { type: 'application/pdf' });
      service.uploadPdf(testFile).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
      expect(req.request.body instanceof FormData).toBe(true);
      expect(req.request.body.has('file')).toBe(true);
    });
    describe('given a valid PDF file', () => {
      it('uploadPdf should succeed and return blob', () => {
        const validFile = new File([], 'valid.pdf', {
          type: 'application/pdf',
        });

        const backendResponse = {
          message: 'File uploaded successfully',
          fileName: 'valid.pdf',
        };

        service.uploadPdf(validFile).subscribe({
          next: (response) => {
            expect(response).toBeTruthy();
            expect(response).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
        const responseBlob = new Blob([JSON.stringify(backendResponse)], {
          type: 'application/json',
        });
        req.flush(responseBlob);
      });
    });
    describe('given an invalid file type', () => {
      it('uploadPdf should return error as Blob with status 400', () => {
        const invalidFile = new File([], 'invalid.txt', { type: 'text/plain' });

        const backendResponse = {
          error: { message: 'Invalid file type' },
        };

        service.uploadPdf(invalidFile).subscribe({
          error: (error) => {
            expect(error.status).toBe(400);
            expect(error.error).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
        const responseBlob = new Blob([JSON.stringify(backendResponse)], {
          type: 'application/json',
        });
        req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
      });
    });
    describe('given no file uploaded', () => {
      it('uploadPdf should return error as Blob with status 400', () => {
        const backendResponse = {
          error: { message: 'No file uploaded' },
        };

        service.uploadPdf(null as any).subscribe({
          error: (error) => {
            expect(error.status).toBe(400);
            expect(error.error).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
        const responseBlob = new Blob([JSON.stringify(backendResponse)], {
          type: 'application/json',
        });
        req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
      });
    });
  });

  describe('Update file request', () => {
    it('method should be PUT', () => {
      const testBlob = new Blob([], { type: 'application/pdf' });
      service.updatePdf(testBlob).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
      expect(req.request.method).toBe('PUT');
    });
    it('should send the file in FormData', () => {
      const testFile = new File([], 'test.pdf', { type: 'application/pdf' });
      service.updatePdf(testFile).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
      expect(req.request.body instanceof FormData).toBe(true);
      expect(req.request.body.has('file')).toBe(true);
    });
    describe('given a valid PDF file', () => {
      it('updatePdf should succeed and return blob', () => {
        const validFile = new Blob([], { type: 'application/pdf' });

        service.updatePdf(validFile).subscribe({
          next: (response) => {
            expect(response).toBeTruthy();
            expect(response).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
        req.flush(validFile);
      });
    });
    describe('given an invalid file type', () => {
      it('updatePdf should return error as Blob with status 400', () => {
        const invalidFile = new Blob([], { type: 'text/plain' });

        const backendResponse = {
          error: { message: 'Failed to update PDF fields' },
        };

        service.updatePdf(invalidFile).subscribe({
          error: (error) => {
            expect(error.status).toBe(400);
            expect(error.error).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
        const responseBlob = new Blob([JSON.stringify(backendResponse)], {
          type: 'application/json',
        });
        req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
      });
    });
    describe('given no file uploaded', () => {
      it('updatePdf should return error as Blob with status 400', () => {
        const backendResponse = {
          error: { message: 'No PDF file uploaded. Please upload a file first.' },
        };

        service.updatePdf(null as any).subscribe({
          error: (error) => {
            expect(error.status).toBe(400);
            expect(error.error).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/file`);
        const responseBlob = new Blob([JSON.stringify(backendResponse)], {
          type: 'application/json',
        });
        req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
      });
    });
  });

  describe('Add PDF field request', () => {
    it('method should be POST', () => {
      const testParams = {
        pageIndex: 0,
        x: 100,
        y: 150,
        canvasWidth: 1200,
        canvasHeight: 1000,
        rotation: 0,
      };

      service.addPdfField(testParams).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields`);
      expect(req.request.method).toBe('POST');
    });
    it('should send correct parameters in the request body', () => {
      const testParams = {
        pageIndex: 0,
        x: 100,
        y: 150,
        canvasWidth: 1200,
        canvasHeight: 1000,
        rotation: 0,
      };

      service.addPdfField(testParams).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields`);
      expect(req.request.body).toEqual(testParams);
    });
    describe('given valid field parameters', () => {
      it('addPdfField should succeed and return blob', () => {
        const validParams = {
          pageIndex: 0,
          x: 100,
          y: 150,
          canvasWidth: 1200,
          canvasHeight: 1000,
          rotation: 0,
        };

        service.addPdfField(validParams).subscribe({
          next: (response) => {
            expect(response).toBeTruthy();
            expect(response).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields`);
        const responseBlob = new Blob([], { type: 'application/pdf' });
        req.flush(responseBlob);

        expect(req.request.body).toEqual(validParams);
      });
    });
    describe('given invalid field parameters', () => {
      it('addPdfField should return error as Blob with status 400', () => {
        const invalidParams = {
          pageIndex: -1,
          x: -100,
          y: -150,
          canvasWidth: 0,
          canvasHeight: 0,
          rotation: 1,
        };
        const backendResponse = {
          error: { message: 'Failed to add PDF field' },
        };

        service.addPdfField(invalidParams).subscribe({
          error: (error) => {
            expect(error.status).toBe(400);
            expect(error.error).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields`);
        const responseBlob = new Blob([JSON.stringify(backendResponse)], {
          type: 'application/json',
        });
        req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
      });
    });
  });

  describe('Remove PDF field values request', () => {
    it('method should be DELETE', () => {
      service.removeFieldsValues().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/values`);
      expect(req.request.method).toBe('DELETE');
    });
    it('removeFieldsValues should succeed and return blob', () => {
      service.removeFieldsValues().subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
          expect(response).toBeInstanceOf(Blob);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/values`);
      const responseBlob = new Blob([], { type: 'application/pdf' });
      req.flush(responseBlob);
    });
    it('should return error as Blob with status 400 on failure', () => {
      const backendResponse = {
        error: { message: 'Failed to remove field values' },
      };

      service.removeFieldsValues().subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBeInstanceOf(Blob);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/values`);
      const responseBlob = new Blob([JSON.stringify(backendResponse)], {
        type: 'application/json',
      });
      req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('Remove PDF field request', () => {
    it('method should be DELETE', () => {
      const fieldName = 'testField';

      service.removeField(fieldName).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
      expect(req.request.method).toBe('DELETE');
    });
    it('should encode field name in the URL', () => {
      const fieldName = 'Imię / Nazwisko';
      const encodedFieldName = encodeURIComponent(fieldName);

      service.removeField(fieldName).subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${encodedFieldName}`);
      req.flush(new Blob([], { type: 'application/pdf' }));
    });
    describe('given a valid field name', () => {
      it('removeField should succeed and return blob', () => {
        const fieldName = 'validFieldName';

        service.removeField(fieldName).subscribe({
          next: (response) => {
            expect(response).toBeTruthy();
            expect(response).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
        const responseBlob = new Blob([], { type: 'application/pdf' });
        req.flush(responseBlob);
      });
    });
    describe('given a non existing field name', () => {
      it('removeField should return error as Blob with status 400', () => {
        const fieldName = 'nonExistingFieldName';

        service.removeField(fieldName).subscribe({
          error: (error) => {
            expect(error.status).toBe(400);
            expect(error.error).toBeInstanceOf(Blob);
          },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
        const responseBlob = new Blob([JSON.stringify({ error: 'Failed to remove PDF field' })], {
          type: 'application/json',
        });
        req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
      });
    });
  });

  describe('Update PDF field request', () => {
    it('method should be PATCH', () => {
      const fieldName = 'testField';
      const testData = {
        newName: 'newTestField',
        canvasWidth: 200,
        canvasHeight: 300,
        width: 400,
        height: 500,
      };

      service.updateField(fieldName, testData).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
      expect(req.request.method).toBe('PATCH');
    });
    it('should encode field name in the URL', () => {
      const fieldName = 'Imię / Nazwisko';
      const encodedFieldName = encodeURIComponent(fieldName);
      const testData = { newName: 'newValidFieldName' };

      service.updateField(fieldName, testData).subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${encodedFieldName}`);
      req.flush(new Blob([], { type: 'application/pdf' }));
    });
    it('should send correct parameters in the request body', () => {
      const fieldName = 'Imię / Nazwisko';
      const encodedFieldName = encodeURIComponent(fieldName);
      const testData = {
        newName: 'newFieldName',
        canvasWidth: 200,
        canvasHeight: 300,
        width: 400,
        height: 500,
      };

      service.updateField(fieldName, testData).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${encodedFieldName}`);
      expect(req.request.body).toEqual(testData);
    });
    describe('given valid field update parameters', () => {
      describe('when updating only the field name', () => {
        it('should succeed and return a blob', () => {
          const fieldName = 'validFieldName';
          const testData = { newName: 'newValidFieldName' };

          service.updateField(fieldName, testData).subscribe({
            next: (response) => {
              expect(response).toBeTruthy();
              expect(response).toBeInstanceOf(Blob);
            },
          });

          const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
          const responseBlob = new Blob([], { type: 'application/pdf' });
          req.flush(responseBlob);
        });
      });
      describe('when updating only the field size', () => {
        it('should succeed and return a blob', () => {
          const fieldName = 'validFieldName';
          const testData = {
            canvasWidth: 200,
            canvasHeight: 300,
            width: 400,
            height: 500,
          };

          service.updateField(fieldName, testData).subscribe({
            next: (response) => {
              expect(response).toBeTruthy();
              expect(response).toBeInstanceOf(Blob);
            },
          });

          const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
          const responseBlob = new Blob([], { type: 'application/pdf' });
          req.flush(responseBlob);
        });
      });
      describe('when updating both name and field size', () => {
        it('should succeed and return a blob', () => {
          const fieldName = 'validFieldName';
          const testData = {
            newName: 'newValidFieldName',
            canvasWidth: 200,
            canvasHeight: 300,
            width: 400,
            height: 500,
          };

          service.updateField(fieldName, testData).subscribe({
            next: (response) => {
              expect(response).toBeTruthy();
              expect(response).toBeInstanceOf(Blob);
            },
          });

          const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
          const responseBlob = new Blob([], { type: 'application/pdf' });
          req.flush(responseBlob);
        });
      });
    });
    describe('given invalid field update parameters', () => {
      describe('when updating only the field name', () => {
        it('should return error as Blob with status 400', () => {
          const fieldName = 'nonExistingFieldName';
          const testData = { newName: 'newValidFieldName' };

          service.updateField(fieldName, testData).subscribe({
            error: (error) => {
              expect(error.status).toBe(400);
              expect(error.error).toBeInstanceOf(Blob);
            },
          });

          const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
          const responseBlob = new Blob([JSON.stringify({ error: 'Failed to update PDF field' })], {
            type: 'application/json',
          });
          req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
        });
      });
      describe('when updating only the field size', () => {
        it('should return error as Blob with status 400', () => {
          const fieldName = 'validFieldName';
          const testData = {
            canvasWidth: -200,
            canvasHeight: -300,
            width: -400,
            height: -500,
          };

          service.updateField(fieldName, testData).subscribe({
            error: (error) => {
              expect(error.status).toBe(400);
              expect(error.error).toBeInstanceOf(Blob);
            },
          });

          const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
          const responseBlob = new Blob([JSON.stringify({ error: 'Failed to update PDF field' })], {
            type: 'application/json',
          });
          req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
        });
      });
      describe('when updating both name and field size', () => {
        it('should return error as Blob with status 400', () => {
          const fieldName = 'validFieldName';
          const testData = {
            newName: 'fieldNameWith/Invalid?Chars',
            canvasWidth: -200,
            canvasHeight: -300,
            width: -400,
            height: -500,
          };

          service.updateField(fieldName, testData).subscribe({
            error: (error) => {
              expect(error.status).toBe(400);
              expect(error.error).toBeInstanceOf(Blob);
            },
          });

          const req = httpMock.expectOne(`${environment.apiUrl}/pdf/fields/${fieldName}`);
          const responseBlob = new Blob([JSON.stringify({ error: 'Failed to update PDF field' })], {
            type: 'application/json',
          });
          req.flush(responseBlob, { status: 400, statusText: 'Bad Request' });
        });
      });
    });
  });
});
