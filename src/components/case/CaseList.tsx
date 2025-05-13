import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { searchCases } from "../../services/case.service";

type Case = {
    id: string;
    numero: string;
    dependencia: string;
    estado: string;
    fechaReporte: string;
    funcionario: string;
    prioridad?: string;
};

const getStatusStyles = (estado: string) => {
    switch (estado) {
        case "Abierto":
            return "bg-yellow-200 text-yellow-800 border-yellow-400 px-3 py-1 rounded-full text-sm";
        case "En proceso":
            return "bg-blue-200 text-blue-800 border-blue-400 px-3 py-1 rounded-full text-sm";
        case "Cerrado":
            return "bg-green-200 text-green-800 border-green-400 px-3 py-1 rounded-full text-sm";
        default:
            return "bg-gray-200 text-gray-800 border-gray-400 px-3 py-1 rounded-full text-sm";
    }
};

const getPriorityStyles = (prioridad: string) => {
    switch (prioridad) {
        case "Alta":
            return "bg-red-200 text-red-800 border-red-400 px-3 py-1 rounded-full text-sm";
        case "Media":
            return "bg-orange-200 text-orange-800 border-orange-400 px-3 py-1 rounded-full text-sm";
        case "Baja":
            return "bg-green-200 text-green-800 border-green-400 px-3 py-1 rounded-full text-sm";
        case "Crítico":
            return "bg-purple-200 text-purple-800 border-purple-400 px-3 py-1 rounded-full text-sm font-bold";
        default:
            return "bg-gray-200 text-gray-800 border-gray-400 px-3 py-1 rounded-full text-sm";
    }
};

const formatDateTime = (isoString: string) => {
    if (!isoString) return 'Fecha no disponible';

    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            console.warn('Fecha inválida recibida:', isoString);
            return 'Fecha inválida';
        }

        return date.toLocaleString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error al formatear fecha:', error, 'Valor:', isoString);
        return 'Fecha inválida';
    }
};

const CaseList = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCases = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters = {
                typeCase: "Mantenimiento"
            };
            const response = await searchCases(filters);

            const mappedCases = response.map((item: any) => ({
                id: item._id,
                numero: item.caseNumber || 'Fallo',
                dependencia: item.dependency || "Sin especificar",
                estado: item.status || "Pendiente",
                fechaReporte: item.reportedAt || item.createdAt,
                funcionario: item.reportedBy?.name || "Sin especificar",
                prioridad: item.serviceData.priority
            }));

            setCases(mappedCases);
        } catch (err) {
            console.error("Error al cargar casos:", err);
            setError("No se pudieron cargar los casos. Intente nuevamente.");
            setCases([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCases();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                        <button
                            onClick={loadCases}
                            className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Función para verificar si algún caso tiene prioridad
    const hasPriority = cases.some(caseItem => caseItem.prioridad);

    return (
        <div className="space-y-4">
            {/* Versión para escritorio/tablet (tabla) */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Caso</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencia</th>
                            {hasPriority && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cases.length > 0 ? (
                            cases.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                >
                                    <td className="p-3 lg:p-4 font-medium">{item.numero}</td>
                                    <td className="p-3 lg:p-4">{item.dependencia}</td>
                                    {hasPriority && (
                                        <td className="p-3 lg:p-4">
                                            {item.prioridad && (
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityStyles(item.prioridad)}`}
                                                >
                                                    {item.prioridad}
                                                </span>
                                            )}
                                        </td>
                                    )}
                                    <td className="p-3 lg:p-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(item.estado)}`}
                                        >
                                            {item.estado}
                                        </span>
                                    </td>
                                    <td className="p-3 lg:p-4 text-gray-500">{formatDateTime(item.fechaReporte)}</td>
                                    <td className="p-3 lg:p-4">{item.funcionario}</td>
                                    <td className="p-3 lg:p-4">
                                        <div className="flex justify-center space-x-4">
                                            <button className="text-yellow-600 hover:text-yellow-900 transition-colors" title="Ver">
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Editar">
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 transition-colors" title="Eliminar">
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={hasPriority ? 7 : 6} className="p-4 text-center text-gray-500">
                                    No se encontraron casos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Versión para móvil (cards) */}
            <div className="md:hidden space-y-3">
                {cases.length > 0 ? (
                    cases.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-900">{item.numero}</h3>
                                    <p className="text-sm text-gray-600">{item.dependencia}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(item.estado)}`}
                                    >
                                        {item.estado}
                                    </span>
                                    {item.prioridad && (
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityStyles(item.prioridad)}`}
                                        >
                                            {item.prioridad}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Fecha</p>
                                    <p>{formatDateTime(item.fechaReporte)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Funcionario</p>
                                    <p>{item.funcionario}</p>
                                </div>
                            </div>

                            <div className="mt-3 flex justify-end space-x-4">
                                <button className="text-yellow-600 hover:text-yellow-900 transition-colors" title="Ver">
                                    <FaEye className="w-4 h-4" />
                                </button>
                                <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Editar">
                                    <FaEdit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900 transition-colors" title="Eliminar">
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
                        No se encontraron casos
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseList;