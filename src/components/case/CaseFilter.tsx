import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { ErrorMessage } from "../ErrorMessage";
import { useState } from "react";

export type CaseFilters = {
    caseNumber?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    reportedBy?: string;
};

interface CaseFilterProps {
    onFilter: (filters: CaseFilters) => void;
    loading: boolean;
    typeCase: "Mantenimiento" | "Preventivo";
}

const CaseFilter = ({ onFilter, loading, typeCase }: CaseFilterProps) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filters, setFilters] = useState<CaseFilters>({
        caseNumber: "",
        status: "",
        priority: "",
        startDate: "",
        endDate: "",
        reportedBy: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (filters.startDate && filters.endDate && new Date(filters.endDate) < new Date(filters.startDate)) {
            setErrorMessage("La fecha final no puede ser menor que la inicial");
            return;
        }
        onFilter(filters);
    };

    const handleReset = () => {
        setFilters({
            caseNumber: "",
            status: "",
            priority: "",
            startDate: "",
            endDate: "",
            reportedBy: ""
        });
        onFilter({});
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
            {errorMessage && (
                <ErrorMessage
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />
            )}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Filtros básicos */}
                    <div>
                        <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            N° Caso
                        </label>
                        <input
                            type="number"
                            id="caseNumber"
                            name="caseNumber"
                            value={filters.caseNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Buscar por número"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">Todos</option>
                            <option value="Abierto">Abierto</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Cerrado">Cerrado</option>
                        </select>
                    </div>



                    {/* Filtros avanzados */}
                    {showAdvancedFilters && (
                        <>
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha inicio
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha final
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleInputChange}
                                    disabled={!filters.startDate}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            {typeCase === "Mantenimiento" && (
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                        Prioridad
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={filters.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option value="">Todas</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                        <option value="Crítico">Crítico</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label htmlFor="reportedBy" className="block text-sm font-medium text-gray-700 mb-1">
                                    Funcionario
                                </label>
                                <input
                                    type="text"
                                    id="reportedBy"
                                    name="reportedBy"
                                    value={filters.reportedBy}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Nombre del funcionario"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    {/* Botones de acción (Buscar y Limpiar) */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <FaSearch className="mr-2" />
                            {loading ? "Buscando..." : "Buscar"}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <FaTimes className="mr-2" />
                            Limpiar
                        </button>
                    </div>

                    {/* Botón de más filtros */}
                    <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                    >
                        <FaFilter className="mr-2" />
                        {showAdvancedFilters ? "Menos filtros" : "Más filtros"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CaseFilter;