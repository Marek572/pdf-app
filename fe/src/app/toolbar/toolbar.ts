import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  standalone: false,
})
export class Toolbar {
  @ViewChild('toolbar', { static: true }) toolbar!: TemplateRef<void>;

  @Input() sidebarVisible: boolean = true;

  @Output() clearAllFields = new EventEmitter<void>();
  @Output() addFormField = new EventEmitter<void>();
}
