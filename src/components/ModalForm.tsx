import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function ModalForm({ isOpen, onClose, title, children }: ModalFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default ModalForm;
