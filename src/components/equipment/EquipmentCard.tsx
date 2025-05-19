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

type EquipmentCardsProps = {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (name: string) => void;
};

const EquipmentCard = ({ equipment, onEdit, onDelete }: EquipmentCardsProps) => {
  return (
    <div>
      {equipment.length > 0 ? (
        equipment.map((item) => (
          <div key={item.name} className="p-4 bg-white rounded-lg shadow-sm mb-4 hover:shadow-md transition">
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
                  onClick={() => onDelete(item.name)}
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
    </div>
  );
};

export default EquipmentCard;