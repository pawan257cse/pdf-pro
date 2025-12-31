import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border shadow-lg min-w-[280px] max-w-md ${colors[toast.type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-xs sm:text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors touch-manipulation"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-[9999] space-y-2 pointer-events-none max-w-md w-[calc(100%-1rem)] sm:w-full px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Simple toast manager using a singleton pattern
let toastIdCounter = 0;
const toastListeners: Array<(toasts: Toast[]) => void> = [];
let globalToasts: Toast[] = [];

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener([...globalToasts]));
};

export const toastManager = {
  show(message: string, type: ToastType = 'info', duration = 3000): string {
    const toast: Toast = {
      id: `toast-${++toastIdCounter}-${Date.now()}`,
      message,
      type,
      duration,
    };
    globalToasts.push(toast);
    notifyListeners();
    return toast.id;
  },
  close(id: string) {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notifyListeners();
  },
  subscribe(listener: (toasts: Toast[]) => void) {
    toastListeners.push(listener);
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  },
  getToasts(): Toast[] {
    return [...globalToasts];
  },
};

// Hook for using toasts in components
export function useToastState() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    setToasts(toastManager.getToasts());
    return unsubscribe;
  }, []);

  return toasts;
}

// Convenience functions
export const toast = {
  success: (message: string, duration = 3000) => toastManager.show(message, 'success', duration),
  error: (message: string, duration = 4000) => toastManager.show(message, 'error', duration),
  warning: (message: string, duration = 3000) => toastManager.show(message, 'warning', duration),
  info: (message: string, duration = 3000) => toastManager.show(message, 'info', duration),
};

