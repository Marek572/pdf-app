import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddFormFieldState {
  private _toggleAddFormField: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleAddFormField$: Observable<boolean> = this._toggleAddFormField.asObservable();

  setDefaultValue(): void {
    this._toggleAddFormField.next(false);
  }

  toggleValue(): void {
    this._toggleAddFormField.next(!this._toggleAddFormField.value);
  }
}
