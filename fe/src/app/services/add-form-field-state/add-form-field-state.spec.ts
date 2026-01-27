import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AddFormFieldState } from './add-form-field-state';

describe('AddFormFieldState', () => {
  let service: AddFormFieldState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AddFormFieldState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
