import { useState } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Equipment = {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  department: string;
  serial?: string;
  numberInventory?: string;
};

type EquipmentCardsProps = {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
};

const ITEMS_PER_PAGE = 10;

const EquipmentCard = ({ equipment, onEdit, onDelete }: EquipmentCardsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(equipment.length / ITEMS_PER_PAGE);

  const getPaginatedEquipment = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return equipment.slice(startIndex, startIndex + ITEMS_PER_PAGE);
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

  const paginatedEquipment = getPaginatedEquipment();

  return (
    <div className="space-y-4">
      {paginatedEquipment.length > 0 ? (
        paginatedEquipment.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm mb-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand} - {item.model}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                  title="Editar equipo"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                  title="Eliminar equipo"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm space-y-1">
              <p><span className="font-medium">Tipo:</span> {item.type}</p>
              <p><span className="font-medium">Dependencia:</span> {item.department}</p>
              {item.serial && <p><span className="font-medium">Serial:</span> {item.serial}</p>}
              {item.numberInventory && <p><span className="font-medium">N° Inventario:</span> {item.numberInventory}</p>}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          No se encontraron equipos
        </div>
      )}

      {equipment.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
                <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, equipment.length)}</span> de{' '}
                <span className="font-medium">{equipment.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Anterior</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
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

export default EquipmentCard;