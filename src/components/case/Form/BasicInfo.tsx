import { useState, useEffect } from "react";
import { getAllDepartments, type DepartmentData } from "../../../services/department.service";

interface BasicInfoProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isPreventive: boolean;
}

const BasicInfo = ({ formData, handleChange, setFormData, isPreventive }: BasicInfoProps) => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadDepartments = async () => {
      setIsLoading(true);
      try {
        const data = await getAllDepartments();
        setDepartments(data);
        setFilteredDepartments(data);
      } catch (err) {
        setError('Error al cargar las dependencias');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, dependency: value });

    if (value.length > 0) {
      const filtered = departments.filter(dept =>
        dept.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered);
      setShowDropdown(true);
    } else {
      setFilteredDepartments(departments);
      setShowDropdown(false);
    }
  };

  const selectDepartment = (department: string) => {
    setFormData({ ...formData, dependency: department });
    setShowDropdown(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Información Básica</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio*</label>
          {isPreventive ? (
            <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
              Mantenimiento Preventivo
            </div>
          ) : (
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccione...</option>
              <option value="Solicitud">Solicitud</option>
              <option value="Incidente">Incidente</option>
              <option value="Concepto técnico">Concepto Técnico</option>
            </select>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dependencia*</label>
          <div className="relative">
            <input
              type="text"
              name="dependency"
              placeholder="Digite la dependencia del caso"
              value={formData.dependency}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              autoComplete="off"
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>

          {showDropdown && filteredDepartments.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {filteredDepartments.map((dept) => (
                <li
                  key={dept.name}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                  onClick={() => selectDepartment(dept.name)}
                >
                  <span className="block truncate">{dept.name}</span>
                </li>
              ))}
            </ul>
          )}

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {showDropdown && filteredDepartments.length === 0 && !isLoading && (
            <p className="mt-1 text-sm text-gray-500">No se encontraron dependencias</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="Abierto">Abierto</option>
            <option value="En proceso">En proceso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        {/* Textareas en una sola fila para pantallas grandes */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Servicio*</label>
            <textarea
              name="serviceData.description"
              value={formData.serviceData.description}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
    </div>
  );
};

export default BasicInfo;