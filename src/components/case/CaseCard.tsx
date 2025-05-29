import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import type { Case } from "./CaseList";
import { formatDateTime, getStatusStyles, getPriorityStyles } from "../Utils";
import { ErrorMessage } from "../ErrorMessage";
import { useNavigate } from "react-router-dom";

type CaseCardsProps = {
    cases: Case[];
    onDelete: (caseId: string) => void;
    onEdit?: (caseId: string) => void;
    isDeleting: boolean;
    error?: string;
    onErrorClose?: () => void;
    typeCase: "Mantenimiento" | "Preventivo";
    onViewPdf: (caseNumber: string) => void;
};

const CaseCards = ({
    cases,
    onDelete,
    isDeleting,
    error,
    onErrorClose,
    typeCase,
    onViewPdf,
}: CaseCardsProps) => {

    const navigate = useNavigate();

    const handleEditClick = (numero: string) => {
        if (typeCase === "Mantenimiento") {
            navigate(`/corrective/edit/${numero}`);
        } else {
            navigate(`/preventive/edit/${numero}`);
        }
    };

    return (
        <div className="space-y-3">
            {error && onErrorClose && (
                <div className="mb-4">
                    <ErrorMessage
                        message={error}
                        onClose={onErrorClose}
                    />
                </div>
            )}

            {cases.length > 0 ? (
                cases.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{item.numero}</h3>
                                <p className="text-sm text-gray-600">{item.dependencia}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <span className={`inline-flex items-center ${getStatusStyles(item.estado)}`}>
                                    {item.estado}
                                </span>
                                {item.prioridad && (
                                    <span className={`inline-flex items-center ${getPriorityStyles(item.prioridad)}`}>
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
                            <div>
                                <p className="text-gray-500">Técnico</p>
                                <p>{item.tecnico || 'Sin asignar'}</p>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-end space-x-4">
                            <button
                                className="text-yellow-600 hover:text-yellow-900 transition-colors"
                                title="Ver"
                                onClick={() => onViewPdf(item.numero)}
                            >
                                <FaEye className="w-4 h-4" />
                            </button>
                            <button
                                className={`text-blue-600 hover:text-blue-900 transition-colors ${item.estado === "Cerrado" ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                title={item.estado === "Cerrado" ? "No se puede editar un caso cerrado" : "Editar"}
                                onClick={() => item.estado !== "Cerrado" && handleEditClick(item.numero)}
                                disabled={item.estado === "Cerrado" || isDeleting}
                            >
                                <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                                className={`text-red-600 hover:text-red-900 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                title="Eliminar"
                                onClick={() => onDelete(item.numero)}
                                disabled={isDeleting}
                            >
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
    );
};

export default CaseCards;