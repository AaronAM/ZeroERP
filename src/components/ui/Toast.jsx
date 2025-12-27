import { Toaster } from 'sonner';

/**
 * Toast provider component - Renders toast notifications
 * Wraps sonner's Toaster with app-specific styling
 */
const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
        },
        className: 'font-sans',
      }}
      closeButton
    />
  );
};

export default Toast;
