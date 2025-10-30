import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddFormFieldState {
  private toggleAddFormField: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleAddFormField$ = this.toggleAddFormField.asObservable();

  setDefaultValue(): void {
    this.toggleAddFormField.next(false);
  }

  toggleValue(): void {
    this.toggleAddFormField.next(!this.toggleAddFormField.value);
  }
}
