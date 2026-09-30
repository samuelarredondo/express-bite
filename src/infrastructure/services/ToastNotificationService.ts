import { INotificationService, ToastMessage, ToastType } from '../../core/domain/interfaces/INotificationService';

export class ToastNotificationService implements INotificationService {
  private toasts: ToastMessage[] = [];
  private listeners: Set<(toasts: ToastMessage[]) => void> = new Set();
  private counter: number = 0;

  public notify(title: string, message: string, type: ToastType = 'emerald', badge?: string): void {
    const id = `toast-${Date.now()}-${this.counter++}`;
    const newToast: ToastMessage = {
      id,
      title,
      message,
      type,
      badge,
      timestamp: Date.now()
    };

    // Keep maximum 4 concurrent toasts
    this.toasts = [newToast, ...this.toasts.slice(0, 3)];
    this.emit();

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      this.dismiss(id);
    }, 4500);
  }

  public dismiss(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.emit();
  }

  public subscribe(listener: (toasts: ToastMessage[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    const snapshot = [...this.toasts];
    this.listeners.forEach(fn => fn(snapshot));
  }
}
