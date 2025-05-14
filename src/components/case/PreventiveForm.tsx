import { createCase } from "../../services/case.service";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useFormData } from "../Data";

const PreventiveForm = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormData("Preventivo");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      setFormData(prev => {
        if (parent in prev && typeof prev[parent as keyof typeof prev] === 'object') {
          return {
            ...prev,
            [parent]: {
              ...(prev[parent as keyof typeof prev] as object),
              [child]: type === 'checkbox' ? checked : value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCase(formData);
      navigate('/preventive');
    } catch (error) {
      console.error("Error creating case:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar lateral - oculto en móvil por defecto */}
      <div className="md:block md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Contenido principal - con margen izquierdo cuando el sidebar está visible */}
      <main className="flex-1">
        {/* Espacio para el header en móvil */}
        <div className="h-16 md:h-0"></div>

        <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
            Nuevo Caso Preventivo
          </h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Sección de información básica */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Solicitud">Solicitud</option>
                    <option value="Programado">Programado</option>
                    <option value="Emergencia">Emergencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dependencia</label>
                  <input
                    type="text"
                    name="dependency"
                    value={formData.dependency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección de quien reporta */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Quien Reporta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="reportedBy.name"
                    value={formData.reportedBy.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    name="reportedBy.position"
                    value={formData.reportedBy.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <input
                    type="text"
                    name="reportedBy.department"
                    value={formData.reportedBy.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Usuario</label>
                  <input
                    type="text"
                    name="reportedBy._id"
                    value={formData.reportedBy._id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Sección de técnico asignado */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Técnico Asignado</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="assignedTechnician.name"
                    value={formData.assignedTechnician.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    name="assignedTechnician.position"
                    value={formData.assignedTechnician.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Técnico</label>
                  <input
                    type="text"
                    name="assignedTechnician._id"
                    value={formData.assignedTechnician._id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Sección de datos del equipo */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Datos del Equipo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Equipo</label>
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
                    required
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
                    required
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>

            {/* Sección de mantenimiento de hardware */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Mantenimiento de Hardware</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(formData.hardware).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`hardware-${key}`}
                      name={`hardware.${key}`}
                      checked={value as boolean}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`hardware-${key}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de mantenimiento de software */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Mantenimiento de Software</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(formData.software).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`software-${key}`}
                      name={`software.${key}`}
                      checked={value as boolean}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`software-${key}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de impresoras */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Impresoras</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(formData.printers).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`printers-${key}`}
                      name={`printers.${key}`}
                      checked={value as boolean}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`printers-${key}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de teléfonos */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Teléfonos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(formData.phones).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`phones-${key}`}
                      name={`phones.${key}`}
                      checked={value as boolean}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`phones-${key}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de escáneres */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Escáneres</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(formData.scanners).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`scanners-${key}`}
                      name={`scanners.${key}`}
                      checked={value as boolean}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`scanners-${key}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/preventive')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Crear Caso
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PreventiveForm;