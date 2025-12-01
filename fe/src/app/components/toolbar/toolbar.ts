import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Button } from '../button/button';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EditFormFieldsState } from '../../services/edit-form-fields-state/edit-form-fields-state';
import { AddFormFieldState } from '../../services/add-form-field-state/add-form-field-state';
import { ApiService } from '../../services/api-service/api-service';
import { FileService } from '../../services/file-service/file-service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  standalone: true,
  imports: [Button, NgxExtendedPdfViewerModule, AsyncPipe],
})
export class Toolbar {
  private _editFormFieldsService: EditFormFieldsState = inject(EditFormFieldsState);
  private _addFormFieldService: AddFormFieldState = inject(AddFormFieldState);
  private _apiService = inject(ApiService);
  private _fileService = inject(FileService);

  sidebarVisible: boolean = true;
  toggleAddFormField$ = this._addFormFieldService.toggleAddFormField$;
  toggleEditFormFields$ = this._editFormFieldsService.toggleEditFormFields$;

  @ViewChild('toolbar', { static: true }) toolbar!: TemplateRef<void>;

  onToggleAddFormFieldClick(): void {
    this._addFormFieldService.toggleValue();
  }

  onToggleEditFormFieldsClick(): void {
    this._editFormFieldsService.toggleValue();
  }

  protected clearAllFields(): void {
    this._apiService.removeFieldsValues().subscribe({
      next: (response: Blob) => this._fileService.updateFileFromBlob(response),
      error: (error: Error) => console.error('Failed to clear fields:', error),
    });
  }
}
