import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type EquipmentModalProps = {
  mode: 'add' | 'edit';
  currentEquipment?: Equipment;
  isProcessing: boolean;
  onClose: () => void;
  onSave: (equipment: Equipment) => Promise<void>;
  title: string;
};

type Equipment = {
  name: string;
  brand: string;
  model: string;
  type: string;
  serial?: string;
  numberInventory?: string;
};

export const EquipmentChangeModal = ({
  mode,
  currentEquipment,
  isProcessing,
  onClose,
  onSave,
  title,
}: EquipmentModalProps) => {
  const [formData, setFormData] = useState<Equipment>({
    name: '',
    brand: '',
    model: '',
    type: '',
    serial: '',
    numberInventory: ''
  });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (currentEquipment) {
      setFormData(currentEquipment);
    } else {
      setFormData({
        name: '',
        brand: '',
        model: '',
        type: '',
        serial: '',
        numberInventory: ''
      });
    }
  }, [currentEquipment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validación básica
      if (!formData.name.trim() || !formData.brand.trim() || !formData.model.trim() || !formData.type.trim()) {
        throw new Error('Los campos obligatorios deben estar completos');
      }
      
      await onSave(formData);
      setLocalError('');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() && 
      formData.brand.trim() && 
      formData.model.trim() && 
      formData.type.trim() &&
      !isProcessing
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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
                {currentEquipment?.name}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del equipo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                autoFocus
                placeholder="Ingrese el nombre del equipo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Ingrese la marca"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Ingrese el modelo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Ingrese el tipo de equipo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de serie
              </label>
              <input
                type="text"
                name="serial"
                value={formData.serial || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese el número de serie (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de inventario
              </label>
              <input
                type="text"
                name="numberInventory"
                value={formData.numberInventory || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese el número de inventario (opcional)"
              />
            </div>
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
              disabled={!isFormValid()}
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