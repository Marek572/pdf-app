import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { PdfSidebarView } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone: false,
  template: `
    <ngx-extended-pdf-viewer
      #pdfViewer
      theme="dark"
      useBrowserLocale="true"
      [page]="page"
      [src]="src"
      [handTool]="false"
      [textLayer]="true"
      [showHandToolButton]="true"
      [filenameForDownload]="filename"
      [enableDragAndDrop]="false"
      [sidebarVisible]="sidebarVisible"
      [activeSidebarView]="activeSidebarView"
      [customToolbar]="toolbarRef.toolbar"
      [customSidebar]="sidebarRef.sidebar"
      (dragover)="dragOver.emit($event)"
      (drop)="drop.emit($event)"
      (pageChange)="pageChange.emit($event)"
    ></ngx-extended-pdf-viewer>

    <app-toolbar
      #toolbarRef
      [sidebarVisible]="sidebarVisible"
      [toggleAddFormField]="toggleAddFormField"
      (clearAllFields)="clearAllFields.emit()"
      (toggleAddFormFieldClick)="toggleAddFormFieldClick.emit()"
    ></app-toolbar>

    <app-sidebar #sidebarRef></app-sidebar>
  `,
})
export class PdfViewer {
  sidebarVisible: boolean = true;
  activeSidebarView: PdfSidebarView = PdfSidebarView.THUMBS;

  @Input() src!: string;
  @Input() filename: string = '';
  @Input() toggleAddFormField: boolean = false;
  @Input() page: number | undefined;

  @Output() dragOver = new EventEmitter<DragEvent>();
  @Output() drop = new EventEmitter<DragEvent>();
  @Output() clearAllFields = new EventEmitter<void>();
  @Output() toggleAddFormFieldClick = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  @ViewChild('toolbarRef', { read: TemplateRef, static: false }) toolbarTpl?: TemplateRef<void>;
  @ViewChild('sidebarRef', { read: TemplateRef, static: false }) sidebarTpl?: TemplateRef<void>;
}
