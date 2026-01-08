import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSettingsPanel } from './field-settings-panel';

describe('FieldSettingPanel', () => {
  let component: FieldSettingsPanel;
  let fixture: ComponentFixture<FieldSettingsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldSettingsPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldSettingsPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
