import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationManagerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto remove after duration
    const duration = notification.duration || 5000;
    const removeTimer = setTimeout(() => {
      handleRemove();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "bg-white border-l-4 rounded-lg shadow-lg p-4 min-w-80 max-w-md transition-all duration-300 transform";
    
    if (isRemoving) {
      return `${baseStyles} translate-x-full opacity-0`;
    }
    
    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    switch (notification.type) {
      case 'success':
        return `${baseStyles} border-green-500 translate-x-0 opacity-100`;
      case 'error':
        return `${baseStyles} border-red-500 translate-x-0 opacity-100`;
      case 'info':
        return `${baseStyles} border-blue-500 translate-x-0 opacity-100`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-gray-900">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {notification.message}
          </p>
        </div>
        <button
          onClick={handleRemove}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationManager;