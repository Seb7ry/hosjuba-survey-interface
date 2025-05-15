import { X } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';

type ConfirmDialogProps = {
  isOpen: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
};

const ConfirmDialog = ({ 
  isOpen, 
  message, 
  onCancel, 
  onConfirm, 
  isProcessing = false 
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Confirmación</h3>
          <button
            type='button'
            onClick={onCancel}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type='button'
            onClick={onCancel}
            disabled={isProcessing}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancelar
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center justify-center min-w-[80px]"
          >
            {isProcessing ? (
              <FaSpinner className="animate-spin h-4 w-4" />
            ) : (
              'Confirmar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;