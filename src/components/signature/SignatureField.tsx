import { useRef, type ChangeEvent } from 'react';
import { Upload, Edit2, X } from 'lucide-react';
import { ErrorMessage } from '../ErrorMessage';

type SignatureFieldProps = {
  signature?: string;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onDraw: () => void;
  onChange: (signature: string) => void;
  onRemove: () => void;
  isRequired?: boolean;
  error?: string;
  onError?: (message: string) => void;
};

export const SignatureField = ({
  signature,
  onUpload,
  onDraw,
  onRemove,
  isRequired = false,
  error,
  onError,
}: SignatureFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      onError?.('Por favor, sube solo imágenes (JPEG, PNG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onError?.('La imagen no debe superar los 2MB');
      return;
    }

    onUpload(e);
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="mb-2">
          <ErrorMessage
            message={error}
            onClose={() => onError?.('')}
          />
        </div>
      )}

      {signature ? (
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-center p-2 border border-gray-300 rounded-md bg-white">
            <img
              src={signature}
              alt="Firma del usuario"
              className="max-h-20 object-contain"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 w-full">
            <button
              type="button"
              onClick={onDraw}
              className="flex items-center justify-center px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              <Edit2 className="mr-1 h-3 w-3" /> Cambiar
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center justify-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              <X className="mr-1 h-3 w-3" /> Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="w-full px-3 py-8 border border-gray-300 rounded-md bg-gray-50 text-center">
            <p className={`text-sm ${isRequired ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {isRequired ? 'Firma requerida*' : 'No hay firma registrada'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 w-full"
            >
              <Upload className="mr-2 h-4 w-4" /> Subir imagen
            </button>
            <button
              type="button"
              onClick={onDraw}
              className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 w-full"
            >
              <Edit2 className="mr-2 h-4 w-4" /> Dibujar firma
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/jpeg,image/png"
            className="hidden"
          />
        </div>
      )}

      {isRequired && !signature && (
        <p className="text-xs text-red-500 mt-1">Debes agregar una firma para continuar</p>
      )}
    </div>
  );
};