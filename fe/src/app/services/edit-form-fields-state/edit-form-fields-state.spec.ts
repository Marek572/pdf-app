import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EditFormFieldsState } from './edit-form-fields-state';

describe('EditFormFieldsState', () => {
  let service: EditFormFieldsState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EditFormFieldsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
