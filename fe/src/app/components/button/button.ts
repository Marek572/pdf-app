import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      mat-icon-button
      class="toolbarButton customButton"
      [title]="btnTitle"
      [disabled]="isDisabled"
      [ngClass]="{
        enabled: !isDisabled,
        disabled: isDisabled,
        active: isActive === true,
        inActive: isActive === false,
      }"
      [attr.isActive]="isActive"
      [attr.matIcon]="btnIcon"
      [attr.iconIconToggle]="iconIconToggle"
      (click)="clickEvent.emit()"
    >
      <mat-icon>
        {{ btnIcon }}
      </mat-icon>
    </button>
  `,
  styles: `
    .customButton {
      color: #c3c3c5;

      &.enabled {
        color: inherit;
        pointer-events: auto;
      }

      &.disabled {
        color: gray;
        pointer-events: none;
      }

      &.active {
        color: lightgreen;
      }

      &.inActive {
        color: red;
      }
    }
  `,
  imports: [MatIcon, CommonModule],
})
export class Button {
  @Input() btnTitle!: string;
  @Input() btnIcon!: string;

  @Input() isDisabled: boolean | undefined;
  @Input() isActive: boolean | undefined;
  @Input() iconIconToggle: boolean | undefined;

  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();
}
