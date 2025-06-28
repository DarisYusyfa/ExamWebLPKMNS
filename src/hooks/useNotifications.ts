import { useState, useCallback } from 'react';
import { Notification } from '../components/NotificationManager';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration });
  }, [addNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    clearAll,
  };
};