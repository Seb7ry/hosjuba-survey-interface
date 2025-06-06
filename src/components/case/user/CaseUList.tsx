import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaStar, FaEye } from "react-icons/fa";
import type { Case } from '../../../pages/CaseU';
import CaseUCard from './CaseUCard';
import { formatDateTime } from "../../Utils";
import CaseURating from './CaseURating';
import { updateCase, getCaseByNumber } from '../../../services/case.service';
import SuccessDialog from '../../SuccessDialog';
import CasePDF from '../CasePDF';
import { getStatusStyles } from "../../Utils";

interface CaseUListProps {
  cases: Case[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
  onRateClick: (id: string) => void;
  windowWidth: number;
  onCaseUpdate: (updatedCase: Case) => void;
}

const CaseUList = ({
  cases,
  currentPage,
  totalPages,
  itemsPerPage,
  onPrevPage,
  onNextPage,
  onPageChange,
  windowWidth,
  onCaseUpdate
}: CaseUListProps) => {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState<'preventive' | 'corrective'>('preventive');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCases, setLocalCases] = useState<Case[]>(cases);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedCaseObservations, setSelectedCaseObservations] = useState('');
  const user = sessionStorage.getItem("username")?.toString();
  const username = user || "";

  useEffect(() => {
    setLocalCases(cases);
  }, [cases]);

  const getPaginatedCases = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return localCases.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleRateClick = async (numero: string, tipoServicio: string) => {
    try {
      const caseData = await getCaseByNumber(numero);
      setSelectedCaseObservations(caseData.observations || '');
      setSelectedCaseNumber(numero);
      const typeCase = tipoServicio.toLowerCase().includes('preventivo') ? 'preventive' : 'corrective';
      setSelectedCaseType(typeCase);
      setRatingModalOpen(true);
    } catch (error) {
      console.error('Error al cargar el caso:', error);
    }
  };

  const handleViewDocument = (numero: string, tipoServicio: string) => {
    setSelectedCaseNumber(numero);
    const typeCase = tipoServicio.toLowerCase().includes('preventivo') ? 'preventive' : 'corrective';
    setSelectedCaseType(typeCase);
    setShowPdfModal(true);
  };

  const handleSubmitRating = async (
    ratings: { satisfaction: number; effectiveness: number },
    signature: string,
    observations?: string
  ) => {
    try {
      setIsSubmitting(true);

      const caseToUpdate = await getCaseByNumber(selectedCaseNumber);

      if (!caseToUpdate) {
        console.error('Caso no encontrado');
        return;
      }

      const updateData = {
        satisfactionRating: { value: ratings.satisfaction },
        effectivenessRating: selectedCaseType === 'corrective' ? { value: ratings.effectiveness } : undefined,
        reportedBy: {
          ...caseToUpdate.reportedBy,
          signature: signature
        },
        observations: observations,
        rated: true,
        status: 'Cerrado',
      };

      const updatedCase = await updateCase(selectedCaseNumber, updateData);

      setLocalCases(prevCases =>
        prevCases.map(c => c.numero === selectedCaseNumber ? {
          ...c,
          rated: true,
          estado: 'Cerrado'
        } : c)
      );

      onCaseUpdate({
        ...updatedCase,
        reportedBy: updatedCase.reportedBy.name,
        toRating: updatedCase.toRating,
        rated: updatedCase.rated,
        id: updatedCase._id,
        numero: updatedCase.caseNumber,
        tipoServicio: updatedCase.typeCase,
        dependencia: updatedCase.dependency,
        estado: updatedCase.status,
        fechaReporte: updatedCase.reportedAt,
        tecnico: updatedCase.assignedTechnician.name,
      });

      setRatingModalOpen(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error al calificar el caso:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {windowWidth >= 1293 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">N° Caso</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Servicio</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencia</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {getPaginatedCases().length > 0 ? (
                getPaginatedCases().map((item: Case) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors text-sm text-gray-700`}
                  >
                    <td className="px-6 py-4 font-medium text-center">{item.numero}</td>
                    <td className="px-6 py-4 text-center"> {item.tipoServicio === 'Mantenimiento' ? 'Correctivo' : 'Preventivo'}</td>
                    <td className="px-6 py-4 text-center">{item.tecnico}</td>
                    <td className="px-6 py-4 text-center">{item.dependencia}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center ${getStatusStyles(item.estado)}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-center">{formatDateTime(item.fechaReporte)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-4">
                        {item.rated || item.estado === 'Cerrado' ? (
                          <button
                            onClick={() => handleViewDocument(item.numero, item.tipoServicio)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver documento del servicio"
                          >
                            <FaEye className="w-4 h-4" />
                            <span>Ver</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRateClick(item.numero, item.tipoServicio)}
                            disabled={!item.toRating}
                            className={`flex items-center space-x-1 ${!item.toRating ?
                              'text-gray-400 opacity-50 cursor-not-allowed' :
                              'text-yellow-600 hover:text-yellow-900'} transition-colors`}
                            title={!item.toRating ? "Este caso no requiere calificación" : "Calificar servicio"}
                          >
                            <FaStar className="w-4 h-4" />
                            <span>Calificar</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron casos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {getPaginatedCases().length > 0 ? (
            getPaginatedCases().map((item) => (
              <CaseUCard
                key={item.numero}
                item={item}
                onRateClick={() => handleRateClick(item.numero, item.tipoServicio)}
                onViewDocument={() => handleViewDocument(item.numero, item.tipoServicio)}
                isRatingDisabled={!item.toRating}
              />
            ))
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
              No se encontraron casos
            </div>
          )}
        </div>
      )}

      {cases.length > itemsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Anterior
            </button>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, cases.length)}</span> de{' '}
                <span className="font-medium">{cases.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={onPrevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Anterior</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={onNextPage}
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

      <CaseURating
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={handleSubmitRating}
        isSubmitting={isSubmitting}
        username={username}
        caseNumber={selectedCaseNumber}
        typeCase={selectedCaseType}
        initialObservations={selectedCaseObservations}
        onSuccess={() => setShowSuccessMessage(true)}
      />

      <SuccessDialog
        isOpen={showSuccessMessage}
        message="La calificación fue enviada correctamente."
        onClose={() => setShowSuccessMessage(false)}
      />

      {selectedCaseNumber && (
        <CasePDF
          isOpen={showPdfModal}
          onClose={() => {
            setTimeout(() => setShowPdfModal(false), 0);
          }}
          caseNumber={selectedCaseNumber}
          typeCase={selectedCaseType === 'preventive' ? 'Preventivo' : 'Mantenimiento'}
        />
      )}
    </div>
  );
};

export default CaseUList;