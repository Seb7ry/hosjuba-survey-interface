import { FaStar, FaEye } from "react-icons/fa";
import { formatDateTime, getStatusStyles } from "../../Utils";
import type { Case } from '../../../pages/CaseU';

interface CaseUCardProps {
  item: Case;
  onRateClick: (id: string) => void;
  onViewDocument: (id: string, tipoServicio: string) => void;
  isRatingDisabled: boolean;
}

const CaseUCard = ({ item, onRateClick, onViewDocument, isRatingDisabled }: CaseUCardProps) => {
  return (
    <div className={`p-4 rounded-lg shadow-sm border ${item.rated ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'} hover:bg-gray-50 transition-colors`}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500">N° Caso</p>
          <p className="font-medium">{item.numero}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Tipo Servicio</p>
          <p className="font-medium">{item.tipoServicio}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Técnico</p>
          <p>{item.tecnico}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Dependencia</p>
          <p>{item.dependencia}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Estado</p>
          <span className={`inline-flex items-center ${getStatusStyles(item.estado)}`}>
            {item.estado}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Fecha</p>
          <p className="text-gray-500">{formatDateTime(item.fechaReporte)}</p>
        </div>
      </div>

      <div className="flex justify-center w-full"> {/* Añadido w-full aquí */}
        {item.rated || item.estado === 'Cerrado' ? (
          <button
            onClick={() => onViewDocument(item.numero, item.tipoServicio)}
            className="flex items-center justify-center space-x-2 py-2 px-4 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors w-full" // Añadido w-full aquí
            title="Ver documento del servicio"
          >
            <FaEye className="w-4 h-4" />
            <span>Ver documento</span>
          </button>
        ) : (
          <button
            onClick={() => onRateClick(item.numero)}
            disabled={isRatingDisabled}
            className={`flex items-center justify-center space-x-2 py-2 px-4 border rounded-md text-sm font-medium transition-colors w-full ${isRatingDisabled // Añadido w-full aquí
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            title={isRatingDisabled ? "Este caso no requiere calificación" : "Calificar servicio"}
          >
            <FaStar className="w-4 h-4" />
            <span>Calificar</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CaseUCard;