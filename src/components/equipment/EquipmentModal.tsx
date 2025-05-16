import { useState, type ChangeEvent, useEffect } from 'react';
import { X } from 'lucide-react';
import ConfirmDialog from '../ConfirmDialog';
import { getAllEquipmentTypes, createEquipmentType, updateEquipmentType, deleteEquipmentType, type EquipmentTypeData } from '../../services/equipmentType.service';
import { EquipmentNewModal } from './EquipmentNewModal';
import { Selector } from '../Selector';
import { ErrorMessage } from '../ErrorMessage';

type EquipmentFormData = {
  name: string;
  brand: string;
  model: string;
  type: string;
  serial?: string;
  numberInventory?: string;
};

type EquipmentFormModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  formData: EquipmentFormData;
  onClose: () => void;
  onSubmit: (formData: EquipmentFormData) => Promise<void>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EquipmentModal = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onInputChange,
}: EquipmentFormModalProps) => {
  const [error, setError] = useState('');
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentTypeData[]>([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeModalMode, setTypeModalMode] = useState<'add' | 'edit'>('add');
  const [currentType, setCurrentType] = useState('');
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [isProcessingType, setIsProcessingType] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadEquipmentTypes();
    }
  }, [isOpen]);

  const loadEquipmentTypes = async () => {
    try {
      setLoadingTypes(true);
      const types = await getAllEquipmentTypes();
      setEquipmentTypes(types);
      setLoadingTypes(false);
    } catch (err: any) {
      setError(err.message);
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.model || !formData.type) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setShowConfirm(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChange = (name: string, value: string) => {
    onInputChange({
      target: { name, value }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Funciones para manejar tipos de equipo
  const handleAddType = () => {
    setTypeModalMode('add');
    setCurrentType('');
    setShowTypeModal(true);
  };

  const handleEditType = (typeName: string) => {
    setTypeModalMode('edit');
    setCurrentType(typeName);
    setShowTypeModal(true);
  };

  const handleDeleteType = async (typeName: string) => {
    try {
      await deleteEquipmentType(typeName);
      await loadEquipmentTypes();
      if (formData.type === typeName) {
        handleChange('type', '');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveType = async (newName: string) => {
    try {
      setIsProcessingType(true);
      const trimmedName = newName.trim();

      if (!trimmedName) {
        setError('El tipo de equipo no puede estar vacío');
        return;
      }

      if (typeModalMode === 'add' ||
        (typeModalMode === 'edit' && trimmedName !== currentType)) {
        const exists = equipmentTypes.some(type =>
          type.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (exists) {
          setError('Ya existe un tipo de equipo con ese nombre');
          return;
        }
      }

      if (typeModalMode === 'add') {
        await createEquipmentType(trimmedName);
        handleChange('type', trimmedName);
      } else {
        if (currentType !== trimmedName) {
          await updateEquipmentType(currentType, trimmedName);
          if (formData.type === currentType) {
            handleChange('type', trimmedName);
          }
        }
      }

      await loadEquipmentTypes();
      setShowTypeModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al procesar la solicitud');
      throw err;
    } finally {
      setIsProcessingType(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? 'Editar Equipo' : 'Nuevo Equipo'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <Selector
                value={formData.type}
                items={equipmentTypes}
                loading={loadingTypes}
                onChange={(value) => handleChange('type', value)}
                onAdd={handleAddType}
                onEdit={() => handleEditType(formData.type)}
                onDelete={() => handleDeleteType(formData.type)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
              <input
                type="text"
                name="serial"
                value={formData.serial || ''}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Inventario</label>
              <input
                type="text"
                name="numberInventory"
                value={formData.numberInventory || ''}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Opcional"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showTypeModal && (
        <EquipmentNewModal
          mode={typeModalMode}
          currentName={currentType}
          isProcessing={isProcessingType}
          onClose={() => setShowTypeModal(false)}
          onSave={handleSaveType}
          title={typeModalMode === 'add' ? 'Agregar Tipo de Equipo' : 'Editar Tipo de Equipo'}
        />
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        message={isEditing ? "¿Estás seguro de actualizar este equipo?" : "¿Estás seguro de crear este equipo?"}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default EquipmentModal;