import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { PdfSidebarView } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone: false,
  template: `
    <ngx-extended-pdf-viewer
      #pdfViewer
      [src]="src"
      useBrowserLocale="true"
      [textLayer]="true"
      [showHandToolButton]="true"
      theme="dark"
      [filenameForDownload]="filename"
      [enableDragAndDrop]="false"
      [sidebarVisible]="sidebarVisible"
      [activeSidebarView]="activeSidebarView"
      (dragover)="dragOver.emit($event)"
      (drop)="drop.emit($event)"
      [customToolbar]="toolbarRef.toolbar"
      [customSidebar]="sidebarRef.sidebar"
      [handTool]="false"
    ></ngx-extended-pdf-viewer>

    <app-toolbar
      #toolbarRef
      (clearAllFields)="clearAllFields.emit()"
      (addFormField)="addFormField.emit()"
      [sidebarVisible]="sidebarVisible"
    ></app-toolbar>

    <app-sidebar #sidebarRef></app-sidebar>
  `,
})
export class PdfViewer {
  sidebarVisible: boolean = true;
  activeSidebarView: PdfSidebarView = PdfSidebarView.THUMBS;

  @Input() src!: string;
  @Input() filename: string = '';

  @Output() dragOver = new EventEmitter<DragEvent>();
  @Output() drop = new EventEmitter<DragEvent>();
  @Output() clearAllFields = new EventEmitter<void>();
  @Output() addFormField = new EventEmitter<void>();

  @ViewChild('toolbarRef', { read: TemplateRef, static: false }) toolbarTpl?: TemplateRef<void>;
  @ViewChild('sidebarRef', { read: TemplateRef, static: false }) sidebarTpl?: TemplateRef<void>;
}
