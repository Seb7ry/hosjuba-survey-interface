import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

type SelectorProps = {
  value: string;
  items: { name: string }[];
  loading: boolean;
  onChange: (value: string) => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const Selector = ({
  value,
  items,
  loading,
  onChange,
  onAdd,
  onEdit,
  onDelete,
}: SelectorProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">Seleccione una opción</option>
        {loading ? (
          <option value="" disabled>Cargando...</option>
        ) : items.length === 0 ? (
          <option value="" disabled>No hay opciones disponibles</option>
        ) : (
          items.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))
        )}
      </select>

      <div className="flex gap-2 sm:flex-nowrap flex-wrap">
        <button
          type="button"
          onClick={onAdd}
          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center justify-center flex-1"
          title="Agregar"
        >
          <Plus className="h-4 w-4" />
        </button>

        {value && (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 flex items-center justify-center flex-1"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center justify-center flex-1"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        message="¿Estás seguro de eliminar este elemento?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          onDelete();
        }}
      />
    </div>
  );
};