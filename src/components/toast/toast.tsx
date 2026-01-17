// components/Toast.tsx
import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

interface ShowToastProps {
  message: string;
  type?: ToastType;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Toast = {
  show: ({ message, type = 'default', description, duration = 3000, action }: ShowToastProps) => {
    const config = {
      description,
      duration,
      action,
    };

    switch (type) {
      case 'success':
        toast.success(message, config);
        break;
      case 'error':
        toast.error(message, config);
        break;
      case 'info':
        toast.info(message, config);
        break;
      case 'warning':
        toast.warning(message, config);
        break;
      default:
        toast(message, config);
    }
  },
};
