import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { ToastMessage, ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper">
      <div
        *ngFor="let toast of toasts"
        class="toast"
        [class.toast-success]="toast.type === 'success'"
        [class.toast-error]="toast.type === 'error'"
        [class.toast-info]="toast.type === 'info'"
      >
        <span class="dot"></span>
        <span class="message">{{ toast.text }}</span>
        <button class="close-btn" (click)="dismiss(toast.id)">×</button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-wrapper {
        position: fixed;
        right: 1.5rem;
        bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 9999;
        pointer-events: none;
      }

      .toast {
        min-width: 260px;
        max-width: 340px;
        padding: 0.7rem 0.9rem;
        border-radius: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.55rem;
        background: #020617;
        border: 1px solid rgba(148, 163, 184, 0.6);
        box-shadow: 0 14px 40px rgba(15, 23, 42, 0.9);
        color: #e5e7eb;
        font-size: 0.85rem;
        pointer-events: auto;
      }

      .toast-success {
        border-color: rgba(34, 197, 94, 0.7);
      }

      .toast-error {
        border-color: rgba(248, 113, 113, 0.8);
      }

      .toast-info {
        border-color: rgba(59, 130, 246, 0.7);
      }

      .dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 999px;
        background: #22c55e;
      }

      .toast-error .dot {
        background: #f97373;
      }

      .toast-info .dot {
        background: #3b82f6;
      }

      .message {
        flex: 1;
      }

      .close-btn {
        border: none;
        background: transparent;
        color: #9ca3af;
        cursor: pointer;
        padding: 0 0.1rem;
        font-size: 1.1rem;
        line-height: 1;
      }

      .close-btn:hover {
        color: #e5e7eb;
      }

      @media (max-width: 640px) {
        .toast-wrapper {
          left: 0.75rem;
          right: 0.75rem;
          bottom: 0.75rem;
        }

        .toast {
          width: 100%;
          max-width: none;
        }
      }
    `,
  ],
})
export class ToastContainerComponent implements OnDestroy {
  toasts: ToastMessage[] = [];
  private sub: Subscription;
  private timers = new Map<number, Subscription>();

  constructor(private toastService: ToastService) {
    this.sub = this.toastService.toasts$.subscribe((toast) => {
      this.toasts = [...this.toasts, toast];
      const timerSub = timer(3500).subscribe(() => this.dismiss(toast.id));
      this.timers.set(toast.id, timerSub);
    });
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    const timerSub = this.timers.get(id);
    if (timerSub) {
      timerSub.unsubscribe();
      this.timers.delete(id);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.timers.forEach((t) => t.unsubscribe());
    this.timers.clear();
  }
}


