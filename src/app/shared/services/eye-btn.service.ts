import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EyeBtnService {
  
  private _showEye = signal(false);
  
  public showEye = this._showEye.asReadonly();

  public toggle(): void {
    this._showEye.set(!this._showEye());
  }

  public show(): void {
    this._showEye.set(true);
  }

  public hide(): void {
    this._showEye.set(false);
  }
}