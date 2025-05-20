import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { getAllUsers, type UserData, updateUser } from "../../../services/user.service";
import { Upload, Edit2, X } from 'lucide-react';
import SignaturePadModal from "../../signature/SignatureModal";
import ConfirmDialog from "../../ConfirmDialog";
import { ErrorMessage } from "../../ErrorMessage";

interface TechnicianInfoProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    isPreventive: boolean;
}

const TechnicianInfo = ({ formData, setFormData }: TechnicianInfoProps) => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsersById, setFilteredUsersById] = useState<UserData[]>([]);
    const [filteredUsersByName, setFilteredUsersByName] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDropdownById, setShowDropdownById] = useState(false);
    const [showDropdownByName, setShowDropdownByName] = useState(false);
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        type: 'upload' | 'draw' | 'remove' | 'change';
        data?: string;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isTechnicianSelected = () => {
        return formData.assignedTechnician._id !== '';
    };

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            try {
                const data = await getAllUsers();
                console.log(data)
                const filteredUsers = data.filter(user =>
                    user.position?.toLowerCase().includes('técnico') ||
                    user.department?.toLowerCase().includes('mantenimiento') ||
                    user.department?.toLowerCase().includes('sistemas')
                );
                setUsers(filteredUsers);
                setFilteredUsersById(filteredUsers);
                setFilteredUsersByName(filteredUsers);
            } catch (err) {
                showError('Error al cargar los técnicos');
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    const showError = (message: string) => {
        setError(message);
        setTimeout(() => setError(null), 5000);
    };

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
            showError('Por favor, sube solo imágenes');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const base64String = event.target.result as string;
                setPendingAction({ type: 'upload', data: base64String });
                setShowConfirmDialog(true);
            }
        };
        reader.onerror = () => showError('Error al cargar la imagen');
        reader.readAsDataURL(file);
    };

    const handleSaveSignature = (signature: string) => {
        setPendingAction({ type: 'draw', data: signature });
        setShowConfirmDialog(true);
    };

    const handleRemoveSignature = () => {
        setPendingAction({ type: 'remove' });
        setShowConfirmDialog(true);
    };

    const handleChangeSignature = () => {
        setPendingAction({ type: 'change' });
        setShowSignaturePad(true);
    };

    const confirmAction = async () => {
        if (!pendingAction || !formData.assignedTechnician._id) {
            setShowConfirmDialog(false);
            return;
        }

        try {
            setIsLoading(true);
            let signature = '';

            if (pendingAction.type === 'upload' || pendingAction.type === 'draw') {
                signature = pendingAction.data || '';
            }

            await updateUser({
                username: formData.assignedTechnician._id,
                name: formData.assignedTechnician.name,
                position: formData.assignedTechnician.position,
                department: formData.assignedTechnician.department,
                signature: signature,
                password: ""
            });

            setFormData({
                ...formData,
                assignedTechnician: {
                    ...formData.assignedTechnician,
                    signature: signature
                }
            });

            const updatedUsers = await getAllUsers();
            setUsers(updatedUsers);
            setFilteredUsersById(updatedUsers);
            setFilteredUsersByName(updatedUsers);

        } catch (err: any) {
            showError(err.response?.data?.message || 'Error al actualizar la firma');
        } finally {
            setIsLoading(false);
            setShowConfirmDialog(false);
            setPendingAction(null);
        }
    };

    const cancelAction = () => {
        setShowConfirmDialog(false);
        setPendingAction(null);
        if (pendingAction?.type === 'change') {
            setShowSignaturePad(false);
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Técnico Asignado</h2>
            <p className="text-sm text-gray-500 mb-4">Puede buscar al técnico por @Username o por Nombre</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo de búsqueda por ID */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Técnico</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="assignedTechnician._id"
                            placeholder="Seleccione el @ del usuario"
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
                            placeholder="Seleccione el nombre del usuario"
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
                                    onClick={handleChangeSignature}
                                    className="flex items-center justify-center px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                    disabled={!isTechnicianSelected()}
                                >
                                    <Edit2 className="mr-1 h-3 w-3" /> Cambiar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveSignature}
                                    className="flex items-center justify-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                                    disabled={!isTechnicianSelected()}
                                >
                                    <X className="mr-1 h-3 w-3" /> Eliminar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="w-full px-3 py-8 border border-gray-200 rounded-md bg-gray-50 text-gray-400 text-center">
                                {isTechnicianSelected() ? "No hay firma registrada" : "Seleccione un técnico primero"}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex items-center justify-center px-3 py-1 text-sm border rounded w-full ${isTechnicianSelected()
                                        ? "border-gray-300 hover:bg-gray-50"
                                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                                        }`}
                                    disabled={!isTechnicianSelected()}
                                >
                                    <Upload className="mr-1 h-3 w-3" /> Subir imagen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => isTechnicianSelected() && setShowSignaturePad(true)}
                                    className={`flex items-center justify-center px-3 py-1 text-sm border rounded w-full ${isTechnicianSelected()
                                        ? "border-gray-300 hover:bg-gray-50"
                                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                                        }`}
                                    disabled={!isTechnicianSelected()}
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
                                disabled={!isTechnicianSelected()}
                            />
                        </div>
                    )}
                </div>
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

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

            <ConfirmDialog
                isOpen={showConfirmDialog}
                message={
                    pendingAction?.type === 'remove' ?
                        '¿Está seguro que desea eliminar la firma?' :
                        '¿Confirmar los cambios en la firma?'
                }
                onCancel={cancelAction}
                onConfirm={confirmAction}
            />
        </div>
    );
};

export default TechnicianInfo;