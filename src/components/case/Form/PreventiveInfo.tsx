import { useState, useEffect, type ChangeEvent } from "react";
import { getAllEquipment, type EquipmentResponse } from "../../../services/equipment.service";

interface PreventiveInfoProps {
    formData: any;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PreventiveInfo = ({ formData, handleChange, setFormData }: PreventiveInfoProps) => {
    const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);
    const [filteredEquipments, setFilteredEquipments] = useState<EquipmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const loadEquipments = async () => {
            setIsLoading(true);
            try {
                const data = await getAllEquipment();
                setEquipments(data);
                setFilteredEquipments(data);
            } catch (err) {
                setError('Error al cargar los equipos');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadEquipments();
    }, []);

    const handleEquipmentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev: any) => ({
            ...prev,
            serviceData: {
                ...prev.serviceData,
                name: value,
                type: value,
                brand: value ? prev.serviceData.brand : '',
                model: value ? prev.serviceData.model : '',
                serial: value ? prev.serviceData.serial : '',
                numberInventory: value ? prev.serviceData.numberInventory : '',
                location: prev.serviceData.location || ''
            }
        }));

        if (value.length > 0) {
            const filtered = equipments.filter(equipment =>
                equipment.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEquipments(filtered);
            setShowDropdown(true);
        } else {
            setFilteredEquipments(equipments);
            setShowDropdown(false);
        }
    };

    const selectEquipment = (equipment: EquipmentResponse) => {
        setFormData((prev: any) => ({
            ...prev,
            serviceData: {
                ...prev.serviceData,
                name: equipment.name,
                type: equipment.type,
                brand: equipment.brand,
                model: equipment.model,
                serial: equipment.serial,
                numberInventory: equipment.numberInventory,
                location: prev.serviceData.location || ''
            }
        }));
        setShowDropdown(false);
    };

    const validateFields = () => {
        if (!formData.serviceData.serial && !formData.serviceData.numberInventory) {
            setError("Debe ingresar al menos el Serial o el Número de Inventario");
            return false;
        }
        setError(null);
        return true;
    };

    const handleBlur = () => {
        validateFields();
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Información del Equipo</h2>
            <p className="text-sm text-gray-500 mb-4">Busque y seleccione el equipo</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Campo de búsqueda de equipo */}
                <div className="relative md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Equipo*</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="serviceData.name"
                            value={formData.serviceData.name}
                            placeholder="Busque el equipo por nombre"
                            onChange={handleEquipmentSearch}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
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

                    {showDropdown && filteredEquipments.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {filteredEquipments.map((equipment) => (
                                <li
                                    key={equipment._id}
                                    className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                                    onClick={() => selectEquipment(equipment)}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{equipment.name}</span>
                                        <span className="text-gray-500"> {equipment.type}</span>
                                        <span className="text-gray-500"> {equipment.brand}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Campos deshabilitados que se llenan automáticamente */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
                        {formData.serviceData.brand || "Marca del equipo"}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
                        {formData.serviceData.model || "Modelo del equipo"}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial</label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
                        {formData.serviceData.serial || "Serial del equipo"}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Inventario</label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
                        {formData.serviceData.numberInventory || "No. Inventario del equipo"}
                    </div>
                </div>

                {/* Nuevo campo para ubicación */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación del Equipo</label>
                    <input
                        type="text"
                        name="serviceData.location"
                        value={formData.serviceData.location || ''}
                        onChange={handleChange}
                        placeholder="Ej: Piso 2, Oficina 203"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {error && (
                    <div className="md:col-span-2 text-sm text-red-600">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreventiveInfo;