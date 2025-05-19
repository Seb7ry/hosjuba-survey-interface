import { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

type Equipment = {
  name: string;
  brand: string;
  model: string;
  type: string;
  department: string;
  serial?: string;
  numberInventory?: string;
};

type EquipmentTableProps = {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (name: string) => void;
};

const EquipmentTable = ({ equipment, onEdit, onDelete }: EquipmentTableProps) => {
  useEffect(() => {
    console.log("Equipos recibidos:", equipment);
  }, [equipment]);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventario</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipment.length > 0 ? (
              equipment.map((item) => (
                <tr key={item.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.model}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.serial || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.numberInventory || '-'}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar equipo"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.name)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar equipo"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron equipos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentTable;