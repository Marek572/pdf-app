import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { PdfSidebarView, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { Toolbar } from '../toolbar/toolbar';
import { Sidebar } from '../sidebar/sidebar';
import { PdfViewerService } from '../../services/pdf-viewer-service/pdf-viewer-service';
import { FileService } from '../../services/file-service/file-service';
import { EditFormFieldsState } from '../../services/edit-form-fields-state/edit-form-fields-state';
import { AddFormFieldState } from '../../services/add-form-field-state/add-form-field-state';
import { ApiService } from '../../services/api-service/api-service';
import { PdfRotation } from '../../models/types';
import { FieldSettings } from '../../services/field-settings/field-settings';
import { FieldSettingsPanel } from '../field-settings-panel/field-settings-panel';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  template: `
    <ngx-extended-pdf-viewer
      #pdfViewer
      theme="dark"
      useBrowserLocale="true"
      [src]="src"
      [page]="page"
      [rotation]="0"
      [handTool]="false"
      [textLayer]="true"
      [showHandToolButton]="true"
      [filenameForDownload]="filename"
      [enableDragAndDrop]="false"
      [activeSidebarView]="activeSidebarView"
      [customToolbar]="toolbarRef.toolbar"
      [customSidebar]="sidebarRef.sidebar"
      [disableForms]="!toggleEditFormFields"
      (click)="addFormField($event)"
      (dragover)="onDragOver($event)"
      (drop)="onDrop($event)"
      (pageChange)="page = $event"
      (rotationChange)="onRotationChange($event)"
      (annotationLayerRendered)="onAnnotationLayerRendered()"
    ></ngx-extended-pdf-viewer>

    <app-field-setting-panel></app-field-setting-panel>

    <app-toolbar #toolbarRef></app-toolbar>
    <app-sidebar #sidebarRef></app-sidebar>
  `,
  imports: [NgxExtendedPdfViewerModule, Toolbar, Sidebar, FieldSettingsPanel],
})
export class PdfViewer implements OnInit, OnDestroy {
  private _pdfViewerService: PdfViewerService = inject(PdfViewerService);
  private _fileService: FileService = inject(FileService);
  private _editFormFieldsState: EditFormFieldsState = inject(EditFormFieldsState);
  private _addFormFieldState: AddFormFieldState = inject(AddFormFieldState);
  private _fieldSettings = inject(FieldSettings);
  private _apiService = inject(ApiService);
  private _destroy$ = new Subject<void>();

  src!: string;
  filename!: string;
  page!: number;
  rotation$: Observable<PdfRotation> = this._pdfViewerService.rotation$;
  toggleEditFormFields!: boolean;
  toggleAddFormField!: boolean;

  activeSidebarView: PdfSidebarView = PdfSidebarView.THUMBS;

  @ViewChild('toolbarRef', { read: TemplateRef, static: false }) toolbarTpl?: TemplateRef<void>;
  @ViewChild('sidebarRef', { read: TemplateRef, static: false }) sidebarTpl?: TemplateRef<void>;

  ngOnInit(): void {
    combineLatest([this._fileService.uploadedFileSrc$, this._fileService.uploadedFileName$])
      .pipe(takeUntil(this._destroy$))
      .subscribe(([src, filename]) => {
        this.src = src;
        this.filename = filename;
        this._pdfViewerService.setRotation(0);
        this.page = 1;
      });

    combineLatest([
      this._editFormFieldsState.toggleEditFormFields$,
      this._addFormFieldState.toggleAddFormField$,
    ])
      .pipe(takeUntil(this._destroy$))
      .subscribe(([editFieldsMode, addFieldMode]) => {
        this.toggleEditFormFields = editFieldsMode;
        this.toggleAddFormField = addFieldMode;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onRotationChange(newRotation: PdfRotation): void {
    this._pdfViewerService.setRotation(newRotation);
  }

  protected addFormField(event: MouseEvent): void {
    if (!this.filename) return console.error('No file has been uploaded yet.');

    const target: HTMLElement = event.target as HTMLElement;

    if (this.toggleAddFormField && target.classList.contains('textLayer')) {
      const canvas = target.parentElement!.querySelector('canvas');
      const rect = canvas!.getBoundingClientRect();

      const params = {
        pageIndex: this.page,
        x: event.clientX - rect.left,
        y: rect.bottom - event.clientY,
        canvasWidth: rect.width,
        canvasHeight: rect.height,
        rotation: this._pdfViewerService.getRotation(),
      };

      this._apiService.addPdfField(params).subscribe({
        next: (response: Blob) => {
          this._fileService.updateFileFromBlob(response);
          this._addFormFieldState.setDefaultValue();
        },
        error: (error: Error) => console.error('Add form field failed:', error),
      });
    }
  }

  protected handleFieldClick(field: any, trigger: CdkOverlayOrigin): void {
    if (!this.toggleEditFormFields) {
      this._fieldSettings.openPanel(field, trigger);
    }
  }

  onAnnotationLayerRendered(): void {
    this._pdfViewerService.onAnnotationLayerRendered();
    this._pdfViewerService.addClickListenersToPdfFields();
  }

  onDragOver(event: DragEvent): void {
    this._fileService.onDragOver(event);
  }

  onDrop(event: DragEvent): void {
    this._fileService.onDrop(event);
  }
}
