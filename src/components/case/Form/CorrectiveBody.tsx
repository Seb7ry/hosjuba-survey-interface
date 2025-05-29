import { useState, useEffect, type ChangeEvent } from "react";
import { getAllEquipment, type EquipmentResponse } from "../../../services/equipment.service";
import { serviceConventions } from "../../Data";
import { ErrorMessage } from "../../../components/ErrorMessage";

interface Equipment {
    name: string;
    brand: string;
    model: string;
    type: string;
    serial: string;
    inventoryNumber: string;
    convention: string;
}

interface Material {
    quantity?: number;
    description?: string;
}

interface CorrectiveBodyProps {
    formData: any;
    handleChange: (e: {
        target: {
            name: string;
            value: any;
        };
    }) => void;
}

const CorrectiveBody = ({ formData, handleChange }: CorrectiveBodyProps) => {
    const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);
    const [filteredEquipments, setFilteredEquipments] = useState<EquipmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);
    const [showDropdowns, setShowDropdowns] = useState<boolean[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadEquipments = async () => {
            setIsLoading(true);
            try {
                const data = await getAllEquipment();
                setEquipments(data);
                setFilteredEquipments(data);
                setShowDropdowns(new Array(formData.serviceData.equipments.length).fill(false));
            } catch (err) {
                setError('Error al cargar los equipos');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadEquipments();
    }, [formData.serviceData.equipments.length]);

    const handleEquipmentSearch = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const updatedEquipments = [...formData.serviceData.equipments];
        updatedEquipments[index] = {
            ...updatedEquipments[index],
            name: value,
            brand: value ? updatedEquipments[index].brand : '',
            model: value ? updatedEquipments[index].model : '',
            type: value ? updatedEquipments[index].type : '',
            serial: value ? updatedEquipments[index].serial : '',
            inventoryNumber: value ? updatedEquipments[index].inventoryNumber : '',
            convention: updatedEquipments[index].convention || ''
        };

        handleChange({
            target: {
                name: "serviceData.equipments",
                value: updatedEquipments
            }
        });

        if (value.length > 0) {
            const filtered = equipments.filter(equipment =>
                equipment.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEquipments(filtered);

            const newShowDropdowns = [...showDropdowns];
            newShowDropdowns[index] = true;
            setShowDropdowns(newShowDropdowns);
        } else {
            setFilteredEquipments(equipments);
            const newShowDropdowns = [...showDropdowns];
            newShowDropdowns[index] = false;
            setShowDropdowns(newShowDropdowns);
        }
    };

    const selectEquipment = (index: number, equipment: EquipmentResponse) => {
        const updatedEquipments = [...formData.serviceData.equipments];
        updatedEquipments[index] = {
            ...updatedEquipments[index],
            name: equipment.name,
            brand: equipment.brand,
            model: equipment.model,
            type: equipment.type,
            serial: equipment.serial,
            inventoryNumber: equipment.numberInventory,
            convention: updatedEquipments[index].convention || ''
        };

        handleChange({
            target: {
                name: "serviceData.equipments",
                value: updatedEquipments
            }
        });

        const newShowDropdowns = [...showDropdowns];
        newShowDropdowns[index] = false;
        setShowDropdowns(newShowDropdowns);
    };

    const handleConventionChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const updatedEquipments = [...formData.serviceData.equipments];
        updatedEquipments[index] = {
            ...updatedEquipments[index],
            convention: value
        };

        handleChange({
            target: {
                name: "serviceData.equipments",
                value: updatedEquipments
            }
        });
    };

    const addEquipment = () => {
        if (formData.serviceData.equipments.length >= 5) {
            setErrorMessage("No se pueden agregar más de 5 equipos");
            return;
        }

        const newEquipment: Equipment = {
            name: "",
            brand: "",
            model: "",
            type: "",
            serial: "",
            inventoryNumber: "",
            convention: ""
        };

        handleChange({
            target: {
                name: "serviceData.equipments",
                value: [newEquipment, ...formData.serviceData.equipments]
            }
        });

        setShowDropdowns([...showDropdowns, false]);
    };

    const removeEquipment = (index: number) => {
        const updatedEquipments = formData.serviceData.equipments
            .filter((_: any, i: number) => i !== index);

        handleChange({
            target: {
                name: "serviceData.equipments",
                value: updatedEquipments
            }
        });

        const newShowDropdowns = [...showDropdowns];
        newShowDropdowns.splice(index, 1);
        setShowDropdowns(newShowDropdowns);
    };

    const handleMaterialChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedMaterials = [...formData.serviceData.materials];
        updatedMaterials[index] = {
            ...updatedMaterials[index],
            [name]: name === "quantity" ? parseInt(value) || 0 : value
        };

        const filteredMaterials = updatedMaterials.map(material => {
            if (material.quantity === 0 && (!material.description || material.description.trim() === "")) {
                return { quantity: undefined, description: undefined };
            }
            return material;
        });

        handleChange({
            target: {
                name: "serviceData.materials",
                value: filteredMaterials
            }
        });
    };

    const addMaterial = () => {
        if (formData.serviceData.materials.length >= 10) {
            setErrorMessage("No se pueden agregar más de 10 materiales");
            return;
        }

        const newMaterial: Material = {
            quantity: undefined,
            description: undefined
        };

        handleChange({
            target: {
                name: "serviceData.materials",
                value: [newMaterial, ...formData.serviceData.materials]
            }
        });
    };

    const removeMaterial = (index: number) => {
        const updatedMaterials = formData.serviceData.materials
            .filter((_: any, i: number) => i !== index);

        handleChange({
            target: {
                name: "serviceData.materials",
                value: updatedMaterials
            }
        });
    };

    return (
        <div className="space-y-6">
            {errorMessage && (
                <ErrorMessage
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />
            )}

            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-700">
                        Equipos Intervenidos
                        <span className="text-sm text-gray-500 ml-2">
                            ({formData.serviceData.equipments.length}/5)
                        </span>
                    </h2>
                    <button
                        type="button"
                        onClick={addEquipment}
                        disabled={formData.serviceData.equipments.length >= 5}
                        className={`px-3 py-1 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${formData.serviceData.equipments.length >= 5
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                            }`}
                    >
                        + Agregar Equipo
                    </button>
                </div>

                <div className="space-y-3">
                    {formData.serviceData.equipments.map((equipment: any, index: number) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                {formData.serviceData.equipments.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeEquipment(index)}
                                        className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                                <div className="relative">
                                    <label className="block text-xs font-medium text-gray-500">Nombre*</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Busque el equipo por nombre"
                                            value={equipment.name}
                                            onChange={(e) => handleEquipmentSearch(index, e)}
                                            onFocus={() => {
                                                const newShowDropdowns = [...showDropdowns];
                                                newShowDropdowns[index] = true;
                                                setShowDropdowns(newShowDropdowns);
                                            }}
                                            onBlur={() => setTimeout(() => {
                                                const newShowDropdowns = [...showDropdowns];
                                                newShowDropdowns[index] = false;
                                                setShowDropdowns(newShowDropdowns);
                                            }, 200)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            autoComplete="off"
                                        />
                                        {isLoading && (
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {showDropdowns[index] && filteredEquipments.length > 0 && (
                                        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {filteredEquipments.map((equipmentItem) => (
                                                <li
                                                    key={equipmentItem._id}
                                                    className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                                                    onClick={() => selectEquipment(index, equipmentItem)}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{equipmentItem.name}</span>
                                                        <span className="text-gray-500 text-xs">{equipmentItem.type}</span>
                                                        <span className="text-gray-500 text-xs">{equipmentItem.brand}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Marca</label>
                                    <div className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500">
                                        {equipment.brand || "Marca del equipo"}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Modelo</label>
                                    <div className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500">
                                        {equipment.model || "Modelo del equipo"}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Tipo</label>
                                    <div className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500">
                                        {equipment.type || "Tipo del equipo"}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Serial</label>
                                    <div className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500">
                                        {equipment.serial || "Serial del equipo"}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">No. de Inventario</label>
                                    <div className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500">
                                        {equipment.inventoryNumber || "Inventario del equipo"}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Convención*</label>
                                    <select
                                        name={`convention-${index}`}
                                        value={equipment.convention || ''}
                                        onChange={(e) => handleConventionChange(index, e)}
                                        required
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Seleccione...</option>
                                        {serviceConventions.map((convention) => (
                                            <option
                                                key={convention.text}
                                                value={convention.text}
                                                title={convention.text}
                                            >
                                                {convention.classification} | {convention.text}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-700">
                        Materiales Utilizados
                        <span className="text-sm text-gray-500 ml-2">
                            ({formData.serviceData.materials.length}/10)
                        </span>
                    </h2>
                    <button
                        type="button"
                        onClick={addMaterial}
                        disabled={formData.serviceData.materials.length >= 10}
                        className={`px-3 py-1 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${formData.serviceData.materials.length >= 10
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                            }`}
                    >
                        + Agregar Material
                    </button>
                </div>

                <div className="space-y-2">
                    {formData.serviceData.materials.map((material: any, index: number) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                {formData.serviceData.materials.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMaterial(index)}
                                        className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Cantidad*</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        placeholder="0"
                                        value={material.quantity || ''}
                                        onChange={(e) => handleMaterialChange(index, e)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Descripción*</label>
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Descripción del material"
                                        value={material.description || ''}
                                        onChange={(e) => handleMaterialChange(index, e)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CorrectiveBody;