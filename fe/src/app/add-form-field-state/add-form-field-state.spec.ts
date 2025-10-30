import { TestBed } from '@angular/core/testing';

import { AddFormFieldState } from './add-form-field-state';

describe('AddFormFieldState', () => {
  let service: AddFormFieldState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddFormFieldState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
