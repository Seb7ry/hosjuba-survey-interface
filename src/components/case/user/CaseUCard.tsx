import { FaStar } from "react-icons/fa";
import { formatDateTime } from "../../Utils";
import type { Case } from '../../../pages/CaseU';

interface CaseUCardProps {
  item: Case;
  onRateClick: (id: string) => void;
  isRatingDisabled: boolean;
}

const CaseUCard = ({ item, onRateClick, isRatingDisabled }: CaseUCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
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
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.estado === 'Completado'
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
      <button
        onClick={() => !isRatingDisabled && onRateClick(item.id)}
        disabled={isRatingDisabled}
        className={`w-full mt-2 text-yellow-500 hover:text-yellow-700 transition-colors flex items-center justify-center ${
          isRatingDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={isRatingDisabled ? "Este caso ya fue calificado" : "Calificar servicio"}
      >
        <FaStar className="w-5 h-5" />
        <span className="ml-1">Calificar</span>
      </button>
    </div>
  );
};

export default CaseUCard;