import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { getAllUsers, type UserData, updateUser } from "../../../services/user.service";
import { Upload, Edit2, X } from 'lucide-react';
import SignaturePadModal from "../../signature/SignatureModal";

interface TechnicianInfoProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isPreventive: boolean;
}

const TechnicianInfo = ({ formData, handleChange, setFormData, isPreventive }: TechnicianInfoProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsersById, setFilteredUsersById] = useState<UserData[]>([]);
  const [filteredUsersByName, setFilteredUsersByName] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdownById, setShowDropdownById] = useState(false);
  const [showDropdownByName, setShowDropdownByName] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsersById(data);
        setFilteredUsersByName(data);
      } catch (err) {
        setError('Error al cargar los técnicos');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      assignedTechnician: {
        ...formData.assignedTechnician,
        _id: value
      }
    });

    if (value.length > 0) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsersById(filtered);
      setShowDropdownById(true);
    } else {
      setFilteredUsersById(users);
      setShowDropdownById(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      assignedTechnician: {
        ...formData.assignedTechnician,
        name: value
      }
    });

    if (value.length > 0) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsersByName(filtered);
      setShowDropdownByName(true);
    } else {
      setFilteredUsersByName(users);
      setShowDropdownByName(false);
    }
  };

  const selectTechnician = (user: UserData) => {
    setFormData({
      ...formData,
      assignedTechnician: {
        _id: user.username,
        name: user.name,
        position: user.position,
        department: user.department,
        signature: user.signature || ''
      }
    });
    setShowDropdownById(false);
    setShowDropdownByName(false);
  };

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
        updateTechnicianSignature(base64String);
      }
    };
    reader.onerror = () => setError('Error al cargar la imagen');
    reader.readAsDataURL(file);
  };

  const handleSaveSignature = (signature: string) => {
    updateTechnicianSignature(signature);
    setShowSignaturePad(false);
  };

  const removeSignature = () => {
    updateTechnicianSignature('');
  };

  const updateTechnicianSignature = async (signature: string) => {
    if (!formData.assignedTechnician._id) {
      setError('Primero seleccione un técnico');
      return;
    }

    try {
      setIsLoading(true);
      await updateUser({
          username: formData.assignedTechnician._id,
          name: formData.assignedTechnician.name,
          position: formData.assignedTechnician.position,
          department: formData.assignedTechnician.department,
          signature: signature,
          password: ""
      });

      // Actualizar el estado local
      setFormData({
        ...formData,
        assignedTechnician: {
          ...formData.assignedTechnician,
          signature: signature
        }
      });

      // Actualizar la lista de usuarios
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
      setFilteredUsersById(updatedUsers);
      setFilteredUsersByName(updatedUsers);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la firma');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Técnico Asignado</h2>
      <p className="text-sm text-gray-500 mb-4">Puede buscar al técnico por ID o por Nombre</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo de búsqueda por ID */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Técnico</label>
          <div className="relative">
            <input
              type="text"
              name="assignedTechnician._id"
              value={formData.assignedTechnician._id}
              onChange={handleIdChange}
              onFocus={() => setShowDropdownById(true)}
              onBlur={() => setTimeout(() => setShowDropdownById(false), 200)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              autoComplete="off"
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>

          {showDropdownById && filteredUsersById.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {filteredUsersById.map((user) => (
                <li
                  key={user.username}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                  onClick={() => selectTechnician(user)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{user.username}</span>
                    <span className="text-gray-500">{user.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Campo de búsqueda por Nombre */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <div className="relative">
            <input
              type="text"
              name="assignedTechnician.name"
              value={formData.assignedTechnician.name}
              onChange={handleNameChange}
              onFocus={() => setShowDropdownByName(true)}
              onBlur={() => setTimeout(() => setShowDropdownByName(false), 200)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              autoComplete="off"
            />
          </div>

          {showDropdownByName && filteredUsersByName.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {filteredUsersByName.map((user) => (
                <li
                  key={user.username}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                  onClick={() => selectTechnician(user)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-500">{user.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Campo de Cargo (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
            {formData.assignedTechnician.position || "Seleccione un técnico"}
          </div>
        </div>

        {/* Campo de Departamento (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
            {formData.assignedTechnician.department || "Seleccione un técnico"}
          </div>
        </div>

        {/* Visualización de Firma (solo para correctivo) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Firma</label>
            {formData.assignedTechnician.signature ? (
              <div className="space-y-2">
                <div className="border border-gray-200 rounded-md p-2 flex justify-center">
                  <img 
                    src={formData.assignedTechnician.signature} 
                    alt="Firma del técnico" 
                    className="max-h-20"
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
                <div className="w-full px-3 py-8 border border-gray-200 rounded-md bg-gray-50 text-gray-400 text-center">
                  No hay firma registrada
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 w-full"
                  >
                    <Upload className="mr-1 h-3 w-3" /> Subir imagen
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSignaturePad(true)}
                    className="flex items-center justify-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 w-full"
                  >
                    <Edit2 className="mr-1 h-3 w-3" /> Dibujar firma
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
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {(showDropdownById || showDropdownByName) && 
       filteredUsersById.length === 0 && 
       filteredUsersByName.length === 0 && 
       !isLoading && (
        <p className="mt-1 text-sm text-gray-500">No se encontraron técnicos</p>
      )}

      <SignaturePadModal
        isOpen={showSignaturePad}
        onClose={() => setShowSignaturePad(false)}
        onSave={handleSaveSignature}
      />
    </div>
  );
};

export default TechnicianInfo;