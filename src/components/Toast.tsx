import { CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl animate-slide-in ${
        type === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-6 h-6" />
      ) : (
        <XCircle className="w-6 h-6" />
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Toast;
