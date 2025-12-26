import { TestBed } from '@angular/core/testing';

import { FieldSettings } from './field-settings';

describe('FieldSettings', () => {
  let service: FieldSettings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldSettings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
