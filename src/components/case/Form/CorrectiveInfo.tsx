import React from 'react';
import { serviceCategories, serviceLevels } from '../../Data';

interface CorrectiveBodyProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const CorrectiveInfo = ({ formData, handleChange }: CorrectiveBodyProps) => {
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
                        onChange={handleChange}
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

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico*</label>
                    <textarea
                        name="serviceData.diagnosis"
                        value={formData.serviceData.diagnosis}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Solución*</label>
                    <textarea
                        name="serviceData.solution"
                        value={formData.serviceData.solution}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default CorrectiveInfo;