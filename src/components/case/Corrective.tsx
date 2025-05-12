import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import Sidebar from "../Sidebar";
import ConfirmDialog from "../ConfirmDialog";
import { ErrorMessage } from "../ErrorMessage";

interface Case {
  id: string;
  caseNumber: string;
  typeCaso: string;
  dependencia: string;
  estado: string;
  creadoEn: string;
  funcionario: string;
}

const mockCases: Case[] = [
  {
    id: "1",
    caseNumber: "CASE-2023-001",
    typeCaso: "Hardware",
    dependencia: "Oficina Principal",
    estado: "Abierto",
    creadoEn: "2023-10-15",
    funcionario: "Juan Pérez",
  },
  {
    id: "2",
    caseNumber: "CASE-2023-002",
    typeCaso: "Software",
    dependencia: "Sucursal Norte",
    estado: "Cerrado",
    creadoEn: "2023-10-10",
    funcionario: "María García",
  },
];

// Componente para mostrar la tabla de casos (pantallas grandes)
const CasesTable = ({
  cases,
  onEdit,
  onDelete,
}: {
  cases: Case[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Número de Caso
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tipo
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Dependencia
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Funcionario
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Estado
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fecha Reporte
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {cases.map((caseItem) => (
          <tr key={caseItem.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {caseItem.caseNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {caseItem.typeCaso}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {caseItem.dependencia}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {caseItem.funcionario}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  caseItem.estado === "Abierto"
                    ? "bg-blue-100 text-blue-800"
                    : caseItem.estado === "Cerrado"
                    ? "bg-green-100 text-green-800"
                    : caseItem.estado === "En proceso"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {caseItem.estado}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {caseItem.creadoEn}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
              <Link
                to={`/maintenance/detail/${caseItem.id}`}
                className="text-blue-600 hover:text-blue-900 p-1"
                title="Ver detalles"
              >
                <FiEye size={16} />
              </Link>
              <button
                onClick={() => onEdit(caseItem.id)}
                className="text-blue-600 hover:text-blue-900 p-1"
                title="Editar"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(caseItem.id)}
                className="text-red-600 hover:text-red-900 p-1"
                title="Eliminar"
              >
                <FiTrash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Componente para mostrar las tarjetas de casos (pantallas pequeñas)
const CasesCards = ({
  cases,
  onEdit,
  onDelete,
}: {
  cases: Case[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="space-y-4 p-4">
      {cases.map((caseItem) => (
        <div key={caseItem.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{caseItem.caseNumber}</h3>
              <p className="text-sm text-gray-500">{caseItem.typeCaso}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                caseItem.estado === "Abierto"
                  ? "bg-blue-100 text-blue-800"
                  : caseItem.estado === "Cerrado"
                  ? "bg-green-100 text-green-800"
                  : caseItem.estado === "En proceso"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {caseItem.estado}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Dependencia</p>
              <p>{caseItem.dependencia}</p>
            </div>
            <div>
              <p className="text-gray-500">Funcionario</p>
              <p>{caseItem.funcionario}</p>
            </div>
            <div>
              <p className="text-gray-500">Fecha Reporte</p>
              <p>{caseItem.creadoEn}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <Link
              to={`/maintenance/detail/${caseItem.id}`}
              className="text-blue-600 hover:text-blue-900 p-1"
              title="Ver detalles"
            >
              <FiEye size={18} />
            </Link>
            <button
              onClick={() => onEdit(caseItem.id)}
              className="text-blue-600 hover:text-blue-900 p-1"
              title="Editar"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(caseItem.id)}
              className="text-red-600 hover:text-red-900 p-1"
              title="Eliminar"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Corrective = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    const timer = setTimeout(() => {
      setCases(mockCases);
      setLoading(false);
    }, 1000);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredCases = cases.filter((caseItem) =>
    caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteInit = (id: string) => {
    const caseItem = cases.find((c) => c.id === id);
    if (caseItem) {
      setCaseToDelete(caseItem);
      setIsConfirmingDelete(true);
    }
  };

  const handleDeleteConfirmed = () => {
    if (!caseToDelete) return;
    
    try {
      setCases(cases.filter((caseItem) => caseItem.id !== caseToDelete.id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConfirmingDelete(false);
      setCaseToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    // Navegar a la página de edición
    window.location.href = `/maintenance/edit/${id}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      <div className="md:block md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 min-w-0">
        <div className="h-16 md:h-0" />

        <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-semibold text-gray-800">
              Mantenimiento Correctivo
            </h1>
            <Link
              to="/maintenance/create"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Nuevo Caso
            </Link>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por número de caso..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="h-8 w-8 text-blue-600 animate-spin">
                <FiSearch className="h-full w-full" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {windowWidth >= 1024 ? (
                <CasesTable
                  cases={filteredCases}
                  onEdit={handleEdit}
                  onDelete={handleDeleteInit}
                />
              ) : (
                <CasesCards
                  cases={filteredCases}
                  onEdit={handleEdit}
                  onDelete={handleDeleteInit}
                />
              )}
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={isConfirmingDelete}
          message={`¿Estás seguro de eliminar el caso ${caseToDelete?.caseNumber}?`}
          onCancel={() => {
            setIsConfirmingDelete(false);
            setCaseToDelete(null);
          }}
          onConfirm={handleDeleteConfirmed}
        />
      </main>
    </div>
  );
};

export default Corrective;