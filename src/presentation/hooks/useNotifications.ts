import { useState, useEffect } from 'react';
import { useServices } from '../di/ServiceContainer';
import { ToastMessage } from '../../core/domain/interfaces/INotificationService';

export function useNotifications() {
  const { notificationService } = useServices();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(activeToasts => {
      setToasts(activeToasts);
    });
    return unsubscribe;
  }, [notificationService]);

  const dismiss = (id: string) => {
    notificationService.dismiss(id);
  };

  return {
    toasts,
    dismiss
  };
}
