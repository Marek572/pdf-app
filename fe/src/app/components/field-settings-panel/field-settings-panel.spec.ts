import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { FieldSettingsPanel } from './field-settings-panel';

describe('FieldSettingPanel', () => {
  let component: FieldSettingsPanel;
  let fixture: ComponentFixture<FieldSettingsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldSettingsPanel],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldSettingsPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
