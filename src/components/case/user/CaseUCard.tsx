import { FaStar, FaEye } from "react-icons/fa";
import { formatDateTime } from "../../Utils";
import type { Case } from '../../../pages/CaseU';

interface CaseUCardProps {
  item: Case;
  onRateClick: (id: string) => void;
  onViewDocument: (id: string, tipoServicio: string) => void;
  isRatingDisabled: boolean;
}

const CaseUCard = ({ item, onRateClick, onViewDocument, isRatingDisabled }: CaseUCardProps) => {
  return (
    <div className={`p-4 rounded-lg shadow-sm border ${item.rated ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
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
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.estado === 'Completado'
            ? 'bg-green-100 text-green-800'
            : item.estado === 'En progreso'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {item.estado}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Fecha</p>
          <p className="text-gray-500">{formatDateTime(item.fechaReporte)}</p>
        </div>
      </div>

      {item.rated || item.estado === 'Cerrado' ? (
        <button
          onClick={() => onViewDocument(item.numero, item.tipoServicio)}
          className="w-full mt-2 py-2 px-4 border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
          title="Ver documento del servicio"
        >
          <FaEye className="w-4 h-4" />
          <span>Ver documento</span>
        </button>
      ) : (
        <button
          onClick={() => onRateClick(item.numero)}
          disabled={isRatingDisabled}
          className={`w-full mt-2 py-2 px-4 border rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${isRatingDisabled
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:border-yellow-300'
            }`}
          title={isRatingDisabled ? "Este caso no requiere calificación" : "Calificar servicio"}
        >
          <FaStar className="w-4 h-4" />
          <span>Calificar</span>
        </button>
      )}
    </div>
  );
};

export default CaseUCard;