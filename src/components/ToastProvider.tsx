import { ReactNode } from 'react';
import { ToastContainer } from './Toast';
import { useToastState } from './Toast';
import { toastManager } from './Toast';

export default function ToastProvider({ children }: { children: ReactNode }) {
  const toasts = useToastState();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onClose={(id) => toastManager.close(id)} />
    </>
  );
}

