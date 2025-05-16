import { CheckCircle2 } from 'lucide-react';

type SuccessDialogProps = {
  isOpen: boolean;
  caseNumber: string | null;
  onClose: () => void;
};

const SuccessDialog = ({ isOpen, caseNumber, onClose }: SuccessDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-6">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Caso creado exitosamente</h3>
          <p className="text-sm text-gray-600 mb-4">
            Número de caso: <span className="font-bold">{caseNumber}</span>
          </p>
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