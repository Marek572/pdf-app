import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ data.dialogTitle }}</h2>
    <mat-dialog-content>{{ data.dialogText }}</mat-dialog-content>
    <mat-dialog-actions>
      <button matButton [mat-dialog-close]="false">Nie</button>
      <button matButton [mat-dialog-close]="true" cdkFocusInitial>Tak</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialog {
  data = inject(MAT_DIALOG_DATA);
}
