import { useState, useRef, type ChangeEvent } from 'react';
import { X, Upload, Edit2 } from 'lucide-react';
import SignaturePadModal from '../SignatureModal';

type FormData = {
  username: string;
  name: string;
  position: string;
  department: string;
  password: string;
  signature?: string;
};

type UserFormModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  formData: FormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
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
  const [signatureMethod, setSignatureMethod] = useState<'upload' | 'draw' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Por favor, sube solo imágenes');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = event.target.result as string;
        onInputChange({
          target: {
            name: 'signature',
            value: base64String,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSignature = (signature: string) => {
    onInputChange({
      target: {
        name: 'signature',
        value: signature,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const removeSignature = () => {
    onInputChange({
      target: {
        name: 'signature',
        value: '',
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  if (!isOpen) return null;

  return (
    <>
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

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEditing ? 'Nueva Contraseña' : 'Contraseña'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma (Opcional)</label>
              
              {formData.signature ? (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-center p-2 border border-gray-300 rounded-md">
                    <img 
                      src={formData.signature} 
                      alt="Firma del usuario" 
                      className="max-h-20 object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSignaturePad(true)}
                      className="flex items-center justify-center px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                    >
                      <Edit2 className="mr-1 h-3 w-3" /> Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={removeSignature}
                      className="flex items-center justify-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      <X className="mr-1 h-3 w-3" /> Eliminar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSignatureMethod('upload');
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Subir imagen
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSignaturePad(true)}
                      className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 w-full"
                    >
                      <Edit2 className="mr-2 h-4 w-4" /> Dibujar firma
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleSignatureUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
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

      <SignaturePadModal
        isOpen={showSignaturePad}
        onClose={() => setShowSignaturePad(false)}
        onSave={handleSaveSignature}
      />
    </>
  );
};

export default UserModal;