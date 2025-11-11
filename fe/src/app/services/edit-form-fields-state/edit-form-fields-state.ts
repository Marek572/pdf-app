import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditFormFieldsState {
  private _toggleEditFormFields: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleEditFormFields$: Observable<boolean> = this._toggleEditFormFields.asObservable();

  toggleValue(): void {
    this._toggleEditFormFields.next(!this._toggleEditFormFields.value);
  }
}
