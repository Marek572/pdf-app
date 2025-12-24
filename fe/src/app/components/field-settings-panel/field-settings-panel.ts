import { Component, inject } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { FieldSettings } from '../../services/field-settings/field-settings';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { PdfViewerService } from '../../services/pdf-viewer-service/pdf-viewer-service';
import { PdfRotation, PdfRotationAngle } from '../../models/types';

@Component({
  selector: 'app-field-setting-panel',
  standalone: true,
  templateUrl: './field-settings-panel.html',
  styleUrl: './field-settings-panel.scss',
  imports: [OverlayModule, MatCardModule, MatInputModule, MatButtonModule],
})
export class FieldSettingsPanel {
  readonly dialog = inject(MatDialog);
  private _fieldSettings = inject(FieldSettings);
  private _pdfViewerService = inject(PdfViewerService);
  state = toSignal(this._fieldSettings.fieldSettings$);

  onCancelClick(): void {
    this._fieldSettings.closePanel();
  }

  onDeleteClick(): void {
    this._fieldSettings.setPreventClose(true);

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        dialogTitle: 'Potwierdzenie usunięcia',
        dialogText: 'Czy na pewno chcesz usunąć to pole?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) this._fieldSettings.removeField();
      this._fieldSettings.setPreventClose(false);
    });
  }

  onSaveClick(fieldWidth: number, fieldHeight: number): void {
    this._fieldSettings.saveChanges(fieldWidth, fieldHeight);
  }

  isHorizontal(): boolean {
    const rotation: PdfRotation = this._pdfViewerService.getRotation();
    return rotation === PdfRotationAngle.Deg90 || rotation === PdfRotationAngle.Deg270;
  }
}
