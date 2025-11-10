import { TestBed } from '@angular/core/testing';

import { EditFormFieldsState } from './edit-form-fields-state';

describe('EditFormFieldsState', () => {
  let service: EditFormFieldsState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditFormFieldsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
