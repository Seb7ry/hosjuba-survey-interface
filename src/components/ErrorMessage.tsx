// components/ErrorMessage.tsx
import { X } from 'lucide-react';

type ErrorMessageProps = {
  message: string;
  onClose: () => void;
};

export const ErrorMessage = ({ message, onClose }: ErrorMessageProps) => (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4">
    <div className="p-3 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500 shadow-lg flex justify-between items-center">
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="text-red-700 hover:text-red-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);