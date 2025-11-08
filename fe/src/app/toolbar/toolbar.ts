import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  standalone: false,
})
export class Toolbar {
  @ViewChild('toolbar', { static: true }) toolbar!: TemplateRef<void>;

  @Input() sidebarVisible!: boolean;
  @Input() toggleAddFormField!: boolean;
  @Input() toggleEditFormFields!: boolean;

  @Output() clearAllFields = new EventEmitter<void>();
  @Output() toggleAddFormFieldClick = new EventEmitter<void>();
  @Output() toggleEditFormFieldsClick = new EventEmitter<void>();
}
