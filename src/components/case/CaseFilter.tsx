import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { ErrorMessage } from "../ErrorMessage";
import { useState, useEffect } from "react";
import { getAllUsers, type UserData } from "../../services/user.service";
import { getAllEquipment, type EquipmentResponse } from "../../services/equipment.service";
import { getAllDepartments, type DepartmentData } from "../../services/department.service";

export type CaseFilters = {
    caseNumber?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    reportedByName?: string;
    technicianName?: string;
    equipmentName?: string;
    dependency?: string;
};

interface CaseFilterProps {
    onFilter: (filters: CaseFilters) => void;
    loading: boolean;
    typeCase: "Mantenimiento" | "Preventivo";
}

const CaseFilter = ({ onFilter, loading, typeCase }: CaseFilterProps) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filters, setFilters] = useState<CaseFilters>({
        caseNumber: "",
        status: "",
        priority: "",
        startDate: "",
        endDate: "",
        reportedByName: "",
        technicianName: "",
        equipmentName: "",
        dependency: ""
    });

    // Estados para los dropdowns de búsqueda
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState<UserData[]>([]);
    const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);
    const [filteredEquipments, setFilteredEquipments] = useState<EquipmentResponse[]>([]);
    const [departments, setDepartments] = useState<DepartmentData[]>([]);
    const [filteredDepartments, setFilteredDepartments] = useState<DepartmentData[]>([]);
    
    const [showTechnicianDropdown, setShowTechnicianDropdown] = useState(false);
    const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);
    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
    
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isLoadingEquipments, setIsLoadingEquipments] = useState(false);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoadingUsers(true);
            setIsLoadingEquipments(true);
            setIsLoadingDepartments(true);
            
            try {
                // Cargar usuarios (para técnicos)
                const usersData = await getAllUsers();
                setUsers(usersData);
                setFilteredTechnicians(usersData);
                
                // Cargar equipos
                const equipmentsData = await getAllEquipment();
                setEquipments(equipmentsData);
                setFilteredEquipments(equipmentsData);
                
                // Cargar dependencias
                const departmentsData = await getAllDepartments();
                setDepartments(departmentsData);
                setFilteredDepartments(departmentsData);
                
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoadingUsers(false);
                setIsLoadingEquipments(false);
                setIsLoadingDepartments(false);
            }
        };

        loadData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleTechnicianSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters(prev => ({ ...prev, technicianName: value }));

        if (value.length > 0) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(value.toLowerCase()) ||
                user.username.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTechnicians(filtered);
            setShowTechnicianDropdown(true);
        } else {
            setFilteredTechnicians(users);
            setShowTechnicianDropdown(false);
        }
    };

    const handleEquipmentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters(prev => ({ ...prev, equipmentName: value }));

        if (value.length > 0) {
            const filtered = equipments.filter(equipment =>
                equipment.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEquipments(filtered);
            setShowEquipmentDropdown(true);
        } else {
            setFilteredEquipments(equipments);
            setShowEquipmentDropdown(false);
        }
    };

    const handleDepartmentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters(prev => ({ ...prev, dependency: value }));

        if (value.length > 0) {
            const filtered = departments.filter(department =>
                department.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredDepartments(filtered);
            setShowDepartmentDropdown(true);
        } else {
            setFilteredDepartments(departments);
            setShowDepartmentDropdown(false);
        }
    };

    const selectTechnician = (user: UserData) => {
        setFilters(prev => ({ ...prev, technicianName: user.name }));
        setShowTechnicianDropdown(false);
    };

    const selectEquipment = (equipment: EquipmentResponse) => {
        setFilters(prev => ({ ...prev, equipmentName: equipment.name }));
        setShowEquipmentDropdown(false);
    };

    const selectDepartment = (department: DepartmentData) => {
        setFilters(prev => ({ ...prev, dependency: department.name }));
        setShowDepartmentDropdown(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (filters.startDate && filters.endDate && new Date(filters.endDate) < new Date(filters.startDate)) {
            setErrorMessage("La fecha final no puede ser menor que la inicial");
            return;
        }

        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== "")
        ) as CaseFilters;

        console.log('Enviando filtros:', cleanFilters);
        onFilter(cleanFilters);
    };

    const handleReset = () => {
        setFilters({
            caseNumber: "",
            status: "",
            priority: "",
            startDate: "",
            endDate: "",
            reportedByName: "",
            technicianName: "",
            equipmentName: "",
            dependency: ""
        });
        setFilteredTechnicians(users);
        setFilteredEquipments(equipments);
        setFilteredDepartments(departments);
        onFilter({});
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
            {errorMessage && (
                <ErrorMessage
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />
            )}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Filtros básicos */}
                    <div>
                        <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            N° Caso
                        </label>
                        <input
                            type="number"
                            id="caseNumber"
                            name="caseNumber"
                            value={filters.caseNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Buscar por número"
                        />
                    </div>

                    {/* Campo de Técnico con búsqueda */}
                    <div className="relative">
                        <label htmlFor="technicianName" className="block text-sm font-medium text-gray-700 mb-1">
                            Técnico
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="technicianName"
                                name="technicianName"
                                value={filters.technicianName}
                                onChange={handleTechnicianSearch}
                                onFocus={() => setShowTechnicianDropdown(true)}
                                onBlur={() => setTimeout(() => setShowTechnicianDropdown(false), 200)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Buscar técnico por nombre o usuario"
                                autoComplete="off"
                            />
                            {isLoadingUsers && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {showTechnicianDropdown && filteredTechnicians.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {filteredTechnicians.map((user) => (
                                    <li
                                        key={user.username}
                                        className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                        onClick={() => selectTechnician(user)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-gray-500">@{user.username}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Campo de Equipo con búsqueda */}
                    <div className="relative">
                        <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700 mb-1">
                            Equipo
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="equipmentName"
                                name="equipmentName"
                                value={filters.equipmentName}
                                onChange={handleEquipmentSearch}
                                onFocus={() => setShowEquipmentDropdown(true)}
                                onBlur={() => setTimeout(() => setShowEquipmentDropdown(false), 200)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Buscar equipo por nombre o serial"
                                autoComplete="off"
                            />
                            {isLoadingEquipments && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {showEquipmentDropdown && filteredEquipments.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {filteredEquipments.map((equipment) => (
                                    <li
                                        key={equipment._id}
                                        className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                        onClick={() => selectEquipment(equipment)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{equipment.name}</span>
                                            <span className="text-gray-500">{equipment.brand}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Filtros avanzados */}
                    {showAdvancedFilters && (
                        <>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="Abierto">Abierto</option>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Cerrado">Cerrado</option>
                                </select>
                            </div>

                            {/* Campo de Dependencia con búsqueda */}
                            <div className="relative">
                                <label htmlFor="dependency" className="block text-sm font-medium text-gray-700 mb-1">
                                    Dependencia
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="dependency"
                                        name="dependency"
                                        value={filters.dependency}
                                        onChange={handleDepartmentSearch}
                                        onFocus={() => setShowDepartmentDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowDepartmentDropdown(false), 200)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Buscar dependencia"
                                        autoComplete="off"
                                    />
                                    {isLoadingDepartments && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {showDepartmentDropdown && filteredDepartments.length > 0 && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        {filteredDepartments.map((department) => (
                                            <li
                                                key={department.name}
                                                className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                                onClick={() => selectDepartment(department)}
                                            >
                                                <div className="font-medium">{department.name}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha inicio
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha final
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleInputChange}
                                    disabled={!filters.startDate}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            {typeCase === "Mantenimiento" && (
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                        Prioridad
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={filters.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option value="">Todas</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                        <option value="Crítico">Crítico</option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    {/* Botones de acción (Buscar y Limpiar) */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <FaSearch className="mr-2" />
                            {loading ? "Buscando..." : "Buscar"}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <FaTimes className="mr-2" />
                            Limpiar
                        </button>
                    </div>

                    {/* Botón de más filtros */}
                    <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                    >
                        <FaFilter className="mr-2" />
                        {showAdvancedFilters ? "Menos filtros" : "Más filtros"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CaseFilter;