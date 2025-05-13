import { FaEdit, FaTrash, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { searchCases } from "../../services/case.service";
import CaseCards from "./CaseCard";
import CaseFilter, { type CaseFilters } from "./CaseFilter";
import { formatDateTime, getStatusStyles, getPriorityStyles } from "../Utils";

export type Case = {
    id: string;
    numero: string;
    dependencia: string;
    estado: string;
    fechaReporte: string;
    funcionario: string;
    prioridad?: string;
};

interface CaseListProps {
    typeCase: "Mantenimiento" | "Preventivo";
}

const ITEMS_PER_PAGE = 10;

const CaseList = ({ typeCase }: CaseListProps) => {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadCases = async (filters: CaseFilters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const queryFilters = {
                typeCase: typeCase,
                ...filters
            };

            const response = await searchCases(queryFilters);

            const mappedCases = response.map((item: any) => ({
                id: item._id,
                numero: item.caseNumber || 'Fallo',
                dependencia: item.dependency || "Sin especificar",
                estado: item.status || "Pendiente",
                fechaReporte: item.reportedAt || item.createdAt,
                funcionario: item.reportedBy?.name || "Sin especificar",
                prioridad: item.serviceData?.priority
            }));

            setCases(mappedCases);
            setTotalPages(Math.ceil(mappedCases.length / ITEMS_PER_PAGE));
            setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
        } catch (err) {
            console.error("Error al cargar casos:", err);
            setError("No se pudieron cargar los casos. Intente nuevamente.");
            setCases([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCases();
    }, []);

    // Obtener los casos para la página actual
    const getPaginatedCases = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return cases.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading && cases.length === 0) {
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
                            onClick={() => loadCases()}
                            className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const hasPriority = cases.some(caseItem => caseItem.prioridad);
    const paginatedCases = getPaginatedCases();

    return (
        <div className="space-y-4">
            <CaseFilter
                onFilter={(filters) => loadCases(filters)}
                loading={loading}
                typeCase={typeCase}  
            />

            {windowWidth >= 1293 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
                            {paginatedCases.length > 0 ? (
                                paginatedCases.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">{item.numero}</td>
                                        <td className="px-6 py-4">{item.dependencia}</td>
                                        {hasPriority && (
                                            <td className="px-6 py-4">
                                                {item.prioridad && (
                                                    <span className={`inline-flex items-center ${getPriorityStyles(item.prioridad)}`}>
                                                        {item.prioridad}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center ${getStatusStyles(item.estado)}`}>
                                                {item.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{formatDateTime(item.fechaReporte)}</td>
                                        <td className="px-6 py-4">{item.funcionario}</td>
                                        <td className="px-6 py-4">
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
                                    <td colSpan={hasPriority ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
                                        No se encontraron casos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <CaseCards cases={paginatedCases} hasPriority={hasPriority} />
            )}

            {/* Paginación */}
            {cases.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
                                <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, cases.length)}</span> de{' '}
                                <span className="font-medium">{cases.length}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="sr-only">Anterior</span>
                                    <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="sr-only">Siguiente</span>
                                    <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseList;