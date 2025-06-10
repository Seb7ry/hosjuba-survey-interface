import React, { useState } from 'react';
import { serviceCategories, serviceLevels } from '../../Data';
import type { UserData } from '../../../services/user.service';
import { getAllUsers } from '../../../services/user.service';
import { useEffect } from 'react';

interface CorrectiveBodyProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const CorrectiveInfo = ({ formData, handleChange, setFormData }: CorrectiveBodyProps) => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsersById, setFilteredUsersById] = useState<UserData[]>([]);
    const [filteredUsersByName, setFilteredUsersByName] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdownById, setShowDropdownById] = useState(false);
    const [showDropdownByName, setShowDropdownByName] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            try {
                const data = await getAllUsers();
                const filteredUsers = data.filter(user =>
                    user.position?.toLowerCase().includes('técnico') ||
                    user.department?.toLowerCase().includes('mantenimiento') ||
                    user.department?.toLowerCase().includes('sistemas')
                );
                setUsers(filteredUsers);
                setFilteredUsersById(filteredUsers);
                setFilteredUsersByName(filteredUsers);
            } catch (err) {
                console.error('Error al cargar los técnicos', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleEscalationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const requiresEscalation = e.target.checked;
        setFormData({
            ...formData,
            serviceData: {
                ...formData.serviceData,
                requiresEscalation,
                escalationTechnician: requiresEscalation ? formData.serviceData.escalationTechnician : {
                    _id: "",
                    name: "",
                    position: "",
                    department: "",
                    signature: "",
                    level: ""
                }
            }
        });
        setIsExpanded(requiresEscalation);
    };

    const handleEscalationIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            serviceData: {
                ...formData.serviceData,
                escalationTechnician: {
                    ...formData.serviceData.escalationTechnician,
                    _id: value
                }
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

    const handleEscalationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            serviceData: {
                ...formData.serviceData,
                escalationTechnician: {
                    ...formData.serviceData.escalationTechnician,
                    name: value
                }
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

    const selectEscalationTechnician = (user: UserData) => {
        setFormData({
            ...formData,
            serviceData: {
                ...formData.serviceData,
                escalationTechnician: {
                    _id: user.username,
                    name: user.name,
                    position: user.position,
                    department: user.department,
                    signature: user.signature || '',
                    level: formData.serviceData.escalationTechnician.level
                }
            }
        });
        setShowDropdownById(false);
        setShowDropdownByName(false);
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Información del Servicio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de atención</label>
                    <input
                        type="datetime-local"
                        name="serviceData.attendedAt"
                        value={formData.serviceData.attendedAt}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de solución</label>
                    <input
                        type="datetime-local"
                        name="serviceData.solvedAt"
                        value={formData.serviceData.solvedAt}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad*</label>
                    <select
                        name="serviceData.priority"
                        value={formData.serviceData.priority}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Crítica">Crítica</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría*</label>
                    <select
                        name="serviceData.category"
                        value={formData.serviceData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Seleccione...</option>
                        {serviceCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel*</label>
                    <select
                        name="serviceData.level"
                        value={formData.serviceData.level}
                        onChange={(e) => {
                            const newLevel = e.target.value;
                            setFormData({
                                ...formData,
                                serviceData: {
                                    ...formData.serviceData,
                                    level: newLevel,
                                    escalationTechnician: {
                                        ...formData.serviceData.escalationTechnician,
                                        ...(formData.serviceData.escalationTechnician.level === newLevel && { level: "" })
                                    }
                                }
                            });
                        }}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Seleccione...</option>
                        {serviceLevels.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
                        <textarea
                            name="serviceData.diagnosis"
                            value={formData.serviceData.diagnosis}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Solución</label>
                        <textarea
                            name="serviceData.solution"
                            value={formData.serviceData.solution}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="requiresEscalation"
                            name="serviceData.requiresEscalation"
                            checked={formData.serviceData.requiresEscalation}
                            onChange={handleEscalationChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="requiresEscalation" className="ml-2 block text-sm font-medium text-gray-700">
                            Requiere escalamiento
                        </label>
                    </div>
                </div>

                <div
                    className={`md:col-span-2 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    {formData.serviceData.requiresEscalation && (
                        <div className="mt-4 space-y-6 border-t pt-4">
                            <h3 className="text-lg font-medium text-gray-700">Escalamiento</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Escalamiento*</label>
                                <select
                                    name="serviceData.escalationTechnician.level"
                                    value={formData.serviceData.escalationTechnician.level}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            serviceData: {
                                                ...formData.serviceData,
                                                escalationTechnician: {
                                                    ...formData.serviceData.escalationTechnician,
                                                    level: e.target.value
                                                }
                                            }
                                        });
                                    }}
                                    required={formData.serviceData.requiresEscalation}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Seleccione el nivel...</option>
                                    {serviceLevels
                                        .filter(level => level !== formData.serviceData.level)
                                        .map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                </select>
                                {formData.serviceData.escalationTechnician.level === formData.serviceData.level && (
                                    <p className="mt-1 text-sm text-red-600">No puedes escalar al mismo nivel del servicio.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Técnico*</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="serviceData.escalationTechnician._id"
                                            placeholder="Seleccione el @ del usuario"
                                            value={formData.serviceData.escalationTechnician._id}
                                            onChange={handleEscalationIdChange}
                                            onFocus={() => setShowDropdownById(true)}
                                            onBlur={() => setTimeout(() => setShowDropdownById(false), 200)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            autoComplete="off"
                                            required={formData.serviceData.requiresEscalation}
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
                                        <div className="relative z-50">
                                            <ul className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                {filteredUsersById.map((user) => (
                                                    <li
                                                        key={user.username}
                                                        className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                                                        onClick={() => selectEscalationTechnician(user)}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">@{user.username}</span>
                                                            <span className="text-gray-500">{user.name}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="serviceData.escalationTechnician.name"
                                            placeholder="Seleccione el nombre del usuario"
                                            value={formData.serviceData.escalationTechnician.name}
                                            onChange={handleEscalationNameChange}
                                            onFocus={() => setShowDropdownByName(true)}
                                            onBlur={() => setTimeout(() => setShowDropdownByName(false), 200)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            autoComplete="off"
                                            required={formData.serviceData.requiresEscalation}
                                        />
                                    </div>

                                    {showDropdownByName && filteredUsersByName.length > 0 && (
                                        <div className="relative z-50">
                                            <ul className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                {filteredUsersByName.map((user) => (
                                                    <li
                                                        key={user.username}
                                                        className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                                                        onClick={() => selectEscalationTechnician(user)}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{user.name}</span>
                                                            <span className="text-gray-500">@{user.username}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                    <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
                                        {formData.serviceData.escalationTechnician.position || "Seleccione un técnico"}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                                    <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
                                        {formData.serviceData.escalationTechnician.department || "Seleccione un técnico"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CorrectiveInfo;