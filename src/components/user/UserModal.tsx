import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import SignaturePadModal from '../signature/SignatureModal';
import ConfirmDialog from '../ConfirmDialog';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment, type DepartmentData } from '../../services/department.service';
import { getAllPosition, createPosition, updatePosition, deletePosition, type PositionData } from '../../services/position.service';
import { Modal } from './sub/SubModal';
import { SignatureField } from '../signature/SignatureField';
import { Selector } from './sub/SubSelector';
import { ErrorMessage } from '../ErrorMessage';

type FormData = {
  username: string;
  name: string;
  position: string;
  department: string;
  password?: string;
  signature?: string;
};

type UserFormModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  formData: FormData;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UserModal = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onInputChange,
}: UserFormModalProps) => {
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [departmentModalMode, setDepartmentModalMode] = useState<'add' | 'edit'>('add');
  const [positionModalMode, setPositionModalMode] = useState<'add' | 'edit'>('add');
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');

  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newPositionName, setNewPositionName] = useState('');
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [isProcessingDepartment, setIsProcessingDepartment] = useState(false);
  const [isProcessingPosition, setIsProcessingPosition] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar departamentos y cargos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadDepartments();
      loadPositions();
    }
  }, [isOpen]);

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const depts = await getAllDepartments();
      setDepartments(depts);
      setLoadingDepartments(false);
    } catch (err: any) {
      setError(err.message);
      setLoadingDepartments(false);
    }
  };

  const loadPositions = async () => {
    try {
      setLoadingPositions(true);
      const pos = await getAllPosition();
      setPositions(pos);
      setLoadingPositions(false);
    } catch (err: any) {
      setError(err.message);
      setLoadingPositions(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Por favor, sube solo imágenes');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = event.target.result as string;
        handleChange('signature', base64String);
      }
    };
    reader.onerror = () => setError('Error al cargar la imagen');
    reader.readAsDataURL(file);
  };

  const handleSaveSignature = (signature: string) => {
    handleChange('signature', signature);
    setShowSignaturePad(false);
  };

  const removeSignature = () => {
    handleChange('signature', '');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.name || !formData.position || !formData.department || (!isEditing && !formData.password)) {
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
      const dataToSubmit = {
        ...formData,
        password: isEditing && !formData.password ? undefined : formData.password
      };
      await onSubmit(dataToSubmit);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChange = (name: string, value: string) => {
    onInputChange({
      target: { name, value }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Funciones para manejar departamentos
  const handleAddDepartment = () => {
    setDepartmentModalMode('add');
    setCurrentDepartment('');
    setNewDepartmentName('');
    setShowDepartmentModal(true);
  };

  const handleEditDepartment = (deptName: string) => {
    setDepartmentModalMode('edit');
    setCurrentDepartment(deptName);
    setNewDepartmentName(deptName);
    setShowDepartmentModal(true);
  };

  const handleDeleteDepartment = async (deptName: string) => {
    try {
      await deleteDepartment(deptName);
      await loadDepartments();
      if (formData.department === deptName) {
        handleChange('department', '');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveDepartment = async (newName: string) => {
    try {
      setIsProcessingDepartment(true);
      const trimmedName = newName.trim();

      if (!trimmedName) {
        setError('El nombre del departamento no puede estar vacío');
        return;
      }

      if (departmentModalMode === 'add' ||
        (departmentModalMode === 'edit' && trimmedName !== currentDepartment)) {
        const exists = departments.some(dept =>
          dept.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (exists) {
          setError('Ya existe un departamento con ese nombre');
          return;
        }
      }

      if (departmentModalMode === 'add') {
        await createDepartment(trimmedName);
        handleChange('department', trimmedName);
      } else {
        if (currentDepartment !== trimmedName) {
          await updateDepartment(currentDepartment, trimmedName);
          if (formData.department === currentDepartment) {
            handleChange('department', trimmedName);
          }
        }
      }

      await loadDepartments();
      setShowDepartmentModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al procesar la solicitud');
      throw err;
    } finally {
      setIsProcessingDepartment(false);
    }
  };

  // Funciones para manejar cargos
  const handleAddPosition = () => {
    setPositionModalMode('add');
    setCurrentPosition('');
    setNewPositionName('');
    setShowPositionModal(true);
  };

  const handleEditPosition = (posName: string) => {
    setPositionModalMode('edit');
    setCurrentPosition(posName);
    setNewPositionName(posName);
    setShowPositionModal(true);
  };

  const handleDeletePosition = async (posName: string) => {
    try {
      await deletePosition(posName);
      await loadPositions();
      if (formData.position === posName) {
        handleChange('position', '');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSavePosition = async (newName: string) => {
    try {
      setIsProcessingPosition(true);
      const trimmedName = newName.trim();

      if (!trimmedName) {
        setError('El nombre del cargo no puede estar vacío');
        return;
      }

      if (positionModalMode === 'add' ||
        (positionModalMode === 'edit' && trimmedName !== currentPosition)) {
        const exists = positions.some(pos =>
          pos.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (exists) {
          setError('Ya existe un cargo con ese nombre');
          return;
        }
      }

      if (positionModalMode === 'add') {
        await createPosition(trimmedName);
        handleChange('position', trimmedName);
      } else {
        if (currentPosition !== trimmedName) {
          await updatePosition(currentPosition, trimmedName);
          if (formData.position === currentPosition) {
            handleChange('position', trimmedName);
          }
        }
      }

      await loadPositions();
      setShowPositionModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al procesar la solicitud');
      throw err;
    } finally {
      setIsProcessingPosition(false);
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
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
              <input
                type="text"
                name="username"
                value={formData.username.toUpperCase()}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  onInputChange(e);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isEditing}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEditing ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password || ''}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required={!isEditing}
                placeholder={isEditing ? "••••••••" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dependencia *</label>
              <Selector
                value={formData.department}
                items={departments}
                loading={loadingDepartments}
                onChange={(value) => handleChange('department', value)}
                onAdd={handleAddDepartment}
                onEdit={() => handleEditDepartment(formData.department)}
                onDelete={() => handleDeleteDepartment(formData.department)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
              <Selector
                value={formData.position}
                items={positions}
                loading={loadingPositions}
                onChange={(value) => handleChange('position', value)}
                onAdd={handleAddPosition}
                onEdit={() => handleEditPosition(formData.position)}
                onDelete={() => handleDeletePosition(formData.position)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma (Opcional)</label>
              <SignatureField
                signature={formData.signature}
                onUpload={handleSignatureUpload}
                onDraw={() => setShowSignaturePad(true)}
                onChange={(signature) => handleChange('signature', signature)}
                onRemove={removeSignature}
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

      {showDepartmentModal && (
        <Modal
          mode={departmentModalMode}
          currentName={currentDepartment}
          isProcessing={isProcessingDepartment}
          onClose={() => setShowDepartmentModal(false)}
          onSave={handleSaveDepartment}
          title={departmentModalMode === 'add' ? 'Agregar Dependencia' : 'Editar Dependencia'}
        />
      )}

      {showPositionModal && (
        <Modal
          mode={positionModalMode}
          currentName={currentPosition}
          isProcessing={isProcessingPosition}
          onClose={() => setShowPositionModal(false)}
          onSave={handleSavePosition}
          title={positionModalMode === 'add' ? 'Agregar Cargo' : 'Editar Cargo'}
        />
      )}

      <SignaturePadModal
        isOpen={showSignaturePad}
        onClose={() => setShowSignaturePad(false)}
        onSave={handleSaveSignature}
      />

      <ConfirmDialog
        isOpen={showConfirm}
        message={isEditing ? "¿Estás seguro de actualizar este usuario?" : "¿Estás seguro de crear este usuario?"}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default UserModal;