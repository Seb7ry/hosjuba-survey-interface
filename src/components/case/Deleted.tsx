import { useEffect, useState } from "react";
import { FaUndo, FaSearch, FaTimes } from "react-icons/fa";
import { getDeletedCases, restoreCase } from "../../services/case.service";
import Sidebar from "../Sidebar";
import { ErrorMessage } from "../ErrorMessage";
import ConfirmDialog from "../ConfirmDialog";
import { formatDateTime } from "../Utils";

type DeletedCase = {
    caseNumber: string;
    deletedAt: string;
    dependency: string;
    technician: string;
};

interface Filters {
    caseNumber?: string;
    dependency?: string;
    technicianName?: string;
}

const Deleted = () => {
    const [deletedCases, setDeletedCases] = useState<DeletedCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [caseToRestore, setCaseToRestore] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<Filters>({
        caseNumber: "",
        dependency: "",
        technicianName: ""
    });

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadDeletedCases = async (searchOnly = false) => {
        try {
            setLoading(true);
            setError(null);
            setShowError(false);
            const params = searchOnly ? { caseNumber: filters.caseNumber } : {};

            const response = await getDeletedCases(params.caseNumber);
            console.log("API Response:", response);

            const mappedCases = response.map((item: any) => ({
                caseNumber: item.originalCase?.caseNumber || 'N/A',
                deletedAt: item.deletedAt || 'N/A',
                dependency: item.originalCase?.dependency || "Sin especificar",
                technician: item.originalCase?.assignedTechnician?.name || "Sin asignar"
            }));

            setDeletedCases(mappedCases);
            setTotalPages(Math.ceil(mappedCases.length / ITEMS_PER_PAGE));
            setCurrentPage(1);
        } catch (err) {
            console.error("Error al cargar casos eliminados:", err);
            setShowError(true);
            setDeletedCases([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeletedCases();
    }, []);

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        loadDeletedCases(newFilters);
    };

    const handleRestoreClick = (caseNumber: string) => {
        setCaseToRestore(caseNumber);
        setShowConfirmDialog(true);
    };

    const handleConfirmRestore = async () => {
        if (!caseToRestore) return;

        try {
            setIsRestoring(true);
            await restoreCase(caseToRestore);
            await loadDeletedCases();
        } catch (err) {
            console.error("Error al restaurar caso:", err);
            setError("No se pudo restaurar el caso. Intente nuevamente.");
            setShowError(true);
        } finally {
            setIsRestoring(false);
            setShowConfirmDialog(false);
            setCaseToRestore(null);
        }
    };

    const handleCancelRestore = () => {
        setShowConfirmDialog(false);
        setCaseToRestore(null);
    };

    const getPaginatedCases = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return deletedCases.slice(startIndex, startIndex + ITEMS_PER_PAGE);
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

    const handleResetFilters = () => {
        setFilters({
            caseNumber: "",
            dependency: "",
            technicianName: ""
        });
        loadDeletedCases();
    };

    const paginatedCases = getPaginatedCases();

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            {/* Sidebar lateral - oculto en móvil por defecto */}
            <div className="md:block md:w-64 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Contenido principal - con margen izquierdo cuando el sidebar está visible */}
            <main className="flex-1">
                {/* Espacio para el header en móvil */}
                <div className="h-16 md:h-0"></div>

                <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Casos Eliminados
                        </h1>
                    </div>

                    {showError && error && (
                        <ErrorMessage
                            message={error}
                            onClose={() => setShowError(false)}
                        />
                    )}

                    <ConfirmDialog
                        isOpen={showConfirmDialog}
                        message="¿Estás seguro que deseas restaurar este caso? El caso volverá a estar disponible en el sistema."
                        onCancel={handleCancelRestore}
                        onConfirm={handleConfirmRestore}
                        isProcessing={isRestoring}
                    />

                    {/* Filtros minimalistas en una sola fila */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="caseNumber"
                                        name="caseNumber"
                                        value={filters.caseNumber}
                                        onChange={(e) => setFilters({ ...filters, caseNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Número de caso"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => loadDeletedCases(true)} // true indica búsqueda específica
                                    disabled={loading}
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                                >
                                    <FaSearch className="mr-2" />
                                    {loading ? "Buscando..." : "Buscar"}
                                </button>

                                <button
                                    onClick={() => {
                                        setFilters({
                                            caseNumber: "",
                                            dependency: "",
                                            technicianName: ""
                                        });
                                        loadDeletedCases();
                                    }}
                                    disabled={loading}
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                                >
                                    <FaTimes className="mr-2" />
                                    Limpiar
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading && deletedCases.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : windowWidth >= 1293 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm">
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">N° Caso</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencia</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Eliminación</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedCases.map((item) => (
                                        <tr key={item.caseNumber} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                            <td className="px-6 py-4 text-center">{item.caseNumber}</td>
                                            <td className="px-6 py-4 text-center">{item.dependency}</td>
                                            <td className="px-6 py-4 text-center">{item.technician}</td>
                                            <td className="px-6 py-4 text-gray-500 text-center">{formatDateTime(item.deletedAt)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleRestoreClick(item.caseNumber)}
                                                    className={`text-green-600 hover:text-green-900 transition-colors ${isRestoring ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    title="Restaurar"
                                                    disabled={isRestoring}
                                                >
                                                    <FaUndo className="w-4 h-4 mx-auto" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {paginatedCases.length > 0 ? (
                                paginatedCases.map((item) => (
                                    <div key={item.caseNumber} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.caseNumber}</h3>
                                                <p className="text-sm text-gray-600">{item.dependency}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDateTime(item.deletedAt)}
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-gray-500">Técnico</p>
                                                <p>{item.technician}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={() => handleRestoreClick(item.caseNumber)}
                                                className={`text-green-600 hover:text-green-900 transition-colors ${isRestoring ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title="Restaurar"
                                                disabled={isRestoring}
                                            >
                                                <FaUndo className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
                                    No se encontraron casos eliminados
                                </div>
                            )}
                        </div>
                    )}

                    {deletedCases.length > ITEMS_PER_PAGE && (
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
                                        <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, deletedCases.length)}</span> de{' '}
                                        <span className="font-medium">{deletedCases.length}</span> resultados
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Deleted;