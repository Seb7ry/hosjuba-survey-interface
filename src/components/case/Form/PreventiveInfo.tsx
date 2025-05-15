import { useState, type ChangeEvent } from "react";

interface PreventiveInfoProps {
    formData: any;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PreventiveInfo = ({ formData, handleChange, setFormData }: PreventiveInfoProps) => {
    const [error, setError] = useState<string | null>(null);

    const validateFields = () => {
        if (!formData.serviceData.serial && !formData.serviceData.inventoryNumber) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo*</label>
                    <input
                        type="text"
                        name="serviceData.type"
                        placeholder="Digite el tipo del equipo"
                        value={formData.serviceData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca*</label>
                    <input
                        type="text"
                        name="serviceData.brand"
                        placeholder="Digite la marca del equipo"
                        value={formData.serviceData.brand}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo*</label>
                    <input
                        type="text"
                        name="serviceData.model"
                        placeholder="Digite el modelo del equipo"
                        value={formData.serviceData.model}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial</label>
                    <input
                        type="text"
                        name="serviceData.serial"
                        placeholder="Digite el serial del equipo"
                        value={formData.serviceData.serial}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Inventario</label>
                    <input
                        type="text"
                        name="serviceData.inventoryNumber"
                        placeholder="Digite el número de inventario del equipo"
                        value={formData.serviceData.inventoryNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
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