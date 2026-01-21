import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toastsSubject = new Subject<ToastMessage>();
  toasts$ = this._toastsSubject.asObservable();

  private idCounter = 0;

  show(type: ToastType, text: string) {
    const message: ToastMessage = {
      id: ++this.idCounter,
      type,
      text,
    };
    this._toastsSubject.next(message);
  }

  success(text: string) {
    this.show('success', text);
  }

  error(text: string) {
    this.show('error', text);
  }

  info(text: string) {
    this.show('info', text);
  }
}


