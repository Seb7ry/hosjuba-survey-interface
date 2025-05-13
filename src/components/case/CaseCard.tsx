import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import type { Case } from "./CaseList";
import { formatDateTime, getStatusStyles, getPriorityStyles } from "../Utils";

type CaseCardsProps = {
    cases: Case[];
    hasPriority: boolean;
};

const CaseCards = ({ cases }: CaseCardsProps) => {
    return (
        <div className="space-y-3">
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
    );
};

export default CaseCards;