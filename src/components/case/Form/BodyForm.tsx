import { formatLabel } from "../../Utils";
import GroupItem from "../../GroupItem";

interface BodyFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isPreventive: boolean;
}

const BodyForm = ({ formData, handleChange, isPreventive }: BodyFormProps) => {
  console.log("isPreventive:", isPreventive);
  
  if (!isPreventive) {
    // Mantenemos el código existente para mantenimiento correctivo
    return (
      <div className="mb-8">
        {/* ... (tu código actual para correctivo) */}
      </div>
    );
  }

  // Función de manejo de cambios mejorada
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handleChange(e); // Mantenemos el handleChange original
    
    // Forzamos el re-renderizado manteniendo el estado actual
    setImmediate(() => {
      const event = {
        target: {
          name: name,
          checked: checked,
          type: "checkbox"
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(event);
    });
  };

  // Estilo uniforme para todas las casillas
  const checkboxStyle = "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2";
  const labelStyle = "block text-sm text-gray-700";
  const itemStyle = "flex items-center p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50";

  return (
    <div className="space-y-6">
      {/* Sección de mantenimiento de hardware */}
      <GroupItem title="Mantenimiento de Hardware (Computadores)">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(formData.serviceData.hardware).map(([key, value]) => (
            <div key={`hardware-${key}`} className={itemStyle}>
              <input
                type="checkbox"
                id={`hardware-${key}`}
                name={`serviceData.hardware.${key}`}
                checked={value as boolean}
                onChange={handleCheckboxChange}
                className={checkboxStyle}
              />
              <label htmlFor={`hardware-${key}`} className={labelStyle}>
                {formatLabel(key)}
              </label>
            </div>
          ))}
        </div>
      </GroupItem>

      {/* Sección de mantenimiento de software */}
      <GroupItem title="Mantenimiento de Software (Computadores)">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(formData.serviceData.software).map(([key, value]) => (
            <div key={`software-${key}`} className={itemStyle}>
              <input
                type="checkbox"
                id={`software-${key}`}
                name={`serviceData.software.${key}`}
                checked={value as boolean}
                onChange={handleCheckboxChange}
                className={checkboxStyle}
              />
              <label htmlFor={`software-${key}`} className={labelStyle}>
                {formatLabel(key)}
              </label>
            </div>
          ))}
        </div>
      </GroupItem>

      {/* Sección de impresoras */}
      <GroupItem title="Mantenimiento de Impresoras">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(formData.serviceData.printers).map(([key, value]) => (
            <div key={`printers-${key}`} className={itemStyle}>
              <input
                type="checkbox"
                id={`printers-${key}`}
                name={`serviceData.printers.${key}`}
                checked={value as boolean}
                onChange={handleCheckboxChange}
                className={checkboxStyle}
              />
              <label htmlFor={`printers-${key}`} className={labelStyle}>
                {formatLabel(key)}
              </label>
            </div>
          ))}
        </div>
      </GroupItem>

      {/* Sección de teléfonos */}
      <GroupItem title="Mantenimiento de Teléfonos">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(formData.serviceData.phones).map(([key, value]) => (
            <div key={`phones-${key}`} className={itemStyle}>
              <input
                type="checkbox"
                id={`phones-${key}`}
                name={`serviceData.phones.${key}`}
                checked={value as boolean}
                onChange={handleCheckboxChange}
                className={checkboxStyle}
              />
              <label htmlFor={`phones-${key}`} className={labelStyle}>
                {formatLabel(key)}
              </label>
            </div>
          ))}
        </div>
      </GroupItem>

      {/* Sección de escáneres */}
      <GroupItem title="Mantenimiento de Escáneres">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(formData.serviceData.scanners).map(([key, value]) => (
            <div key={`scanners-${key}`} className={itemStyle}>
              <input
                type="checkbox"
                id={`scanners-${key}`}
                name={`serviceData.scanners.${key}`}
                checked={value as boolean}
                onChange={handleCheckboxChange}
                className={checkboxStyle}
              />
              <label htmlFor={`scanners-${key}`} className={labelStyle}>
                {formatLabel(key)}
              </label>
            </div>
          ))}
        </div>
      </GroupItem>
    </div>
  );
};

export default BodyForm;

function setImmediate(arg0: () => void) {
  throw new Error("Function not implemented.");
}
