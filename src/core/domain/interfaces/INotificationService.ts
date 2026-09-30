export type ToastType = 'emerald' | 'amber' | 'blue' | 'rose' | 'slate';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  badge?: string;
  timestamp: number;
}

/**
 * Port: INotificationService
 * Interface for decoupled application notifications
 */
export interface INotificationService {
  notify(title: string, message: string, type?: ToastType, badge?: string): void;
  subscribe(listener: (toasts: ToastMessage[]) => void): () => void;
  dismiss(id: string): void;
}
