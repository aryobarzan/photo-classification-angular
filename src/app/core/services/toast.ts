import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

// A helper service to support toast notifications across the app.
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast = signal<Toast | null>(null);
  private timer: number | null = null;

  show(message: string, type: 'success' | 'error', duration = 4000) {
    if (this.timer) clearTimeout(this.timer);
    this.toast.set({ message, type });
    this.timer = setTimeout(() => this.toast.set(null), duration);
  }

  dismiss() {
    if (this.timer) clearTimeout(this.timer);
    this.toast.set(null);
  }
}
