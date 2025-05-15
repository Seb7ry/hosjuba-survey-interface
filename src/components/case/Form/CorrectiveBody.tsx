import { type ChangeEvent } from "react";

type CustomChangeEvent = {
    target: {
        name: string;
        value: any;
    };
};

interface CorrectiveBodyProps {
    formData: any;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | CustomChangeEvent) => void;
}

const CorrectiveBody = ({ formData, handleChange }: CorrectiveBodyProps) => {
    const handleEquipmentChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newEvent = {
            target: {
                name: `serviceData.equipments[${index}].${name}`,
                value: value
            }
        } as unknown as ChangeEvent<HTMLInputElement>;
        handleChange(newEvent);
    };
    
    const addEquipment = () => {
        const newEvent = {
            target: {
                name: "serviceData.equipments",
                value: [
                    ...formData.serviceData.equipments,
                    { name: "", brand: "", model: "", serial: "", inventoryNumber: "" }
                ]
            }
        } as unknown as ChangeEvent<HTMLInputElement>;
        handleChange(newEvent);
    };

    const removeEquipment = (index: number) => {
        const updatedEquipments = formData.serviceData.equipments.filter((_: any, i: number) => i !== index);
        const newEvent = {
            target: {
                name: "serviceData.equipments",
                value: updatedEquipments
            }
        } as unknown as ChangeEvent<HTMLInputElement>;
        handleChange(newEvent);
    };

    const handleMaterialChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newEvent = {
            ...e,
            target: {
                ...e.target,
                name: `serviceData.materials[${index}].${name}`,
                value: name === "quantity" ? parseInt(value) || 0 : value
            }
        };
        handleChange(newEvent);
    };

    const addMaterial = () => {
        const newEvent = {
            target: {
                name: "serviceData.materials",
                value: [
                    ...formData.serviceData.materials,
                    { quantity: 0, description: "" }
                ]
            }
        } as unknown as ChangeEvent<HTMLInputElement>;
        handleChange(newEvent);
    };

    const removeMaterial = (index: number) => {
        const updatedMaterials = formData.serviceData.materials.filter((_: any, i: number) => i !== index);
        const newEvent = {
            target: {
                name: "serviceData.materials",
                value: updatedMaterials
            }
        } as unknown as ChangeEvent<HTMLInputElement>;
        handleChange(newEvent);
    };

    return (
        <div className="space-y-6">
            {/* Sección de Equipos */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-700">Equipos Intervenidos</h2>
                    <button
                        type="button"
                        onClick={addEquipment}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Nombre*</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nombre"
                                        value={equipment.name}
                                        onChange={(e) => handleEquipmentChange(index, e)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Marca</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        placeholder="Marca"
                                        value={equipment.brand}
                                        onChange={(e) => handleEquipmentChange(index, e)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Modelo</label>
                                    <input
                                        type="text"
                                        name="model"
                                        placeholder="Modelo"
                                        value={equipment.model}
                                        onChange={(e) => handleEquipmentChange(index, e)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Serial</label>
                                    <input
                                        type="text"
                                        name="serial"
                                        placeholder="Serial"
                                        value={equipment.serial}
                                        onChange={(e) => handleEquipmentChange(index, e)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500">Inventario</label>
                                    <input
                                        type="text"
                                        name="inventoryNumber"
                                        placeholder="N° Inventario"
                                        value={equipment.inventoryNumber}
                                        onChange={(e) => handleEquipmentChange(index, e)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de Materiales */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-700">Materiales Utilizados</h2>
                    <button
                        type="button"
                        onClick={addMaterial}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                        value={material.quantity}
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
                                        value={material.description}
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