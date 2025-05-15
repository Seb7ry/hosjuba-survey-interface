import BasicInfo from "./BasicInfo";
import ReporterInfo from "./ReporterInfo";
import TechnicianInfo from "./TechnicianInfo";

interface HeadFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isPreventive: boolean;
}

const HeadForm = ({ formData, handleChange, setFormData, isPreventive }: HeadFormProps) => {
  return (
    <>
      <BasicInfo
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        isPreventive={isPreventive}
      />

      <ReporterInfo
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
      />

      <TechnicianInfo
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        isPreventive={isPreventive}
      />

      {/* Sección de información del equipo - solo para preventivo */}
      {isPreventive && (
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Información del Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Equipo*</label>
              <select
                name="serviceData.type"
                value={formData.serviceData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Computador">Computador</option>
                <option value="Impresora">Impresora</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Escáner">Escáner</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                name="serviceData.brand"
                value={formData.serviceData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                name="serviceData.model"
                value={formData.serviceData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial</label>
              <input
                type="text"
                name="serviceData.serial"
                value={formData.serviceData.serial}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Inventario</label>
              <input
                type="text"
                name="serviceData.inventoryNumber"
                value={formData.serviceData.inventoryNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sección de información adicional para correctivo */}
      {!isPreventive && (
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Información del Servicio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad*</label>
              <select
                name="serviceData.priority"
                value={formData.serviceData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría*</label>
              <input
                type="text"
                name="serviceData.category"
                value={formData.serviceData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel*</label>
              <input
                type="text"
                name="serviceData.level"
                value={formData.serviceData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico*</label>
              <textarea
                name="serviceData.diagnosis"
                value={formData.serviceData.diagnosis}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Solución*</label>
              <textarea
                name="serviceData.solution"
                value={formData.serviceData.solution}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border bo rder-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeadForm;