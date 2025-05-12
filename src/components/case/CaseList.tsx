import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

interface Case {
  id: string;
  caseNumber: string;
  typeCaso: string;
  dependencia: string;
  estado: string;
  creadoEn: string;
  funcionario: string;
}

interface MaintenanceCaseListProps {
  cases: Case[];
  onDelete: (id: string) => void;
}

const CaseList = ({ cases, onDelete }: MaintenanceCaseListProps) => {
  return (
    <div>
      {/* Vista de tabla para pantallas grandes */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
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
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <FiEye />
                    </Link>
                    <Link
                      to={`/maintenance/edit/${caseItem.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </Link>
                    <button
                      onClick={() => onDelete(caseItem.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de tarjetas para pantallas pequeñas */}
      <div className="md:hidden space-y-4">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">
                  {caseItem.caseNumber}
                </h3>
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
              <Link
                to={`/maintenance/edit/${caseItem.id}`}
                className="text-blue-600 hover:text-blue-900 p-1"
                title="Editar"
              >
                <FiEdit2 size={18} />
              </Link>
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

      {cases.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay casos registrados.
        </div>
      )}
    </div>
  );
};

export default CaseList;