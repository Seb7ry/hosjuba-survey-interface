import { CheckCircle2 } from 'lucide-react';

type SuccessDialogProps = {
  isOpen: boolean;
  caseNumber?: string | null;
  message?: string;
  label?: string;
  onClose: () => void;
};

const SuccessDialog = ({
  isOpen,
  caseNumber = null,
  message = 'Operación realizada exitosamente',
  label = 'Número de caso',
  onClose
}: SuccessDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-6 pointer-events-auto">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>
          {caseNumber && (
            <p className="text-sm text-gray-600 mb-4">
              {label}: <span className="font-bold">{caseNumber}</span>
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;
