import { useState, useEffect } from "react";
import { getAllUsers, type UserData } from "../../../services/user.service";

interface ReporterInfoProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ReporterInfo = ({ formData, setFormData }: ReporterInfoProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsersById, setFilteredUsersById] = useState<UserData[]>([]);
  const [filteredUsersByName, setFilteredUsersByName] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdownById, setShowDropdownById] = useState(false);
  const [showDropdownByName, setShowDropdownByName] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsersById(data);
        setFilteredUsersByName(data);
      } catch (err) {
        setError('Error al cargar los usuarios');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, reportedBy: { ...formData.reportedBy, _id: value } });

    if (value.length > 0) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsersById(filtered);
      setShowDropdownById(true);
    } else {
      setFilteredUsersById(users);
      setShowDropdownById(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, reportedBy: { ...formData.reportedBy, name: value } });

    if (value.length > 0) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsersByName(filtered);
      setShowDropdownByName(true);
    } else {
      setFilteredUsersByName(users);
      setShowDropdownByName(false);
    }
  };

  const selectUser = (user: UserData) => {
    setFormData({
      ...formData,
      reportedBy: {
        _id: user.username,
        name: user.name,
        position: user.position,
        department: user.department
      }
    });
    setShowDropdownById(false);
    setShowDropdownByName(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-gray-700 mb-4 border-b pb-2">Quien Reporta</h2>
      <p className="text-sm text-gray-500 mb-4">Puede buscar al usuario por su @Username o por Nombre</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo de búsqueda por ID */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario*</label>
          <div className="relative">
            <input
              type="text"
              name="reportedBy._id"
              value={formData.reportedBy._id}
              placeholder="Seleccione el @ del usuario"
              onChange={handleIdChange}
              onFocus={() => setShowDropdownById(true)}
              onBlur={() => setTimeout(() => setShowDropdownById(false), 200)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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

          {showDropdownById && filteredUsersById.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {filteredUsersById.map((user) => (
                <li
                  key={user.username}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                  onClick={() => selectUser(user)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">@{user.username}</span>
                    <span className="text-gray-500">{user.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Seleccione el nombre del usuario"
              name="reportedBy.name"
              value={formData.reportedBy.name}
              onChange={handleNameChange}
              onFocus={() => setShowDropdownByName(true)}
              onBlur={() => setTimeout(() => setShowDropdownByName(false), 200)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              autoComplete="off"
            />
          </div>

          {showDropdownByName && filteredUsersByName.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {filteredUsersByName.map((user) => (
                <li
                  key={user.username}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                  onClick={() => selectUser(user)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-500">{user.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
            {formData.reportedBy.position || "Seleccione un usuario"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dependencia</label>
          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
            {formData.reportedBy.department || "Seleccione un usuario"}
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {(showDropdownById || showDropdownByName) &&
        filteredUsersById.length === 0 &&
        filteredUsersByName.length === 0 &&
        !isLoading && (
          <p className="mt-1 text-sm text-gray-500">No se encontraron usuarios</p>
        )}
    </div>
  );
};

export default ReporterInfo;