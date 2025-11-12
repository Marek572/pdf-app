import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      mat-icon-button
      class="toolbarButton customButton"
      [ngClass]="{
        enabled: !isDisabled,
        disabled: isDisabled,
        active: isActive === true,
        inActive: isActive === false,
      }"
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

  @Input() isDisabled?: boolean;
  @Input() isActive?: boolean;

  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('attr.title') get title() {
    return this.btnTitle;
  }

  @HostBinding('attr.disabled') get disabledAttr() {
    return this.isDisabled ? '' : null;
  }

  @HostBinding('attr.isActive') get isActiveAttr() {
    return this.isActive ? '' : null;
  }

  @HostBinding('attr.mat-icon') get matIcon() {
    return this.btnIcon;
  }

  @HostListener('click')
  onClick() {
    if (!this.isDisabled) this.clickEvent.emit();
  }
}
