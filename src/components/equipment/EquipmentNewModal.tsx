import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type Equipment = {
  name: string;
  brand: string;
  model: string;
  type: string;
  serial?: string;
  numberInventory?: string;
};

type EquipmentModalProps = {
  mode: 'add' | 'edit';
  currentName?: string;
  isProcessing: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  title: string;
};

export const EquipmentNewModal = ({
  mode,
  currentName = '',
  isProcessing,
  onClose,
  onSave,
  title,
}: EquipmentModalProps) => {
  const [name, setName] = useState(currentName);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        throw new Error('El nombre del equipo es obligatorio');
      }
      await onSave(name);
      setLocalError('');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {localError && (
            <div className="p-2 bg-red-50 text-red-700 rounded-md text-sm">
              {localError}
            </div>
          )}

          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre actual
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {currentName}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'add' ? 'Nombre del equipo' : 'Nuevo nombre'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
              placeholder={mode === 'edit' ? 'Ingrese el nuevo nombre' : ''}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={
                !name.trim() || 
                (mode === 'edit' && name.trim() === currentName) ||
                isProcessing
              }
            >
              {isProcessing ? (
                'Procesando...'
              ) : mode === 'add' ? (
                'Agregar'
              ) : (
                'Actualizar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};