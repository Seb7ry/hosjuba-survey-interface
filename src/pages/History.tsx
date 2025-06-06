import { useEffect, useState, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HistoryList from '../components/history/HistoryList';
import HistoryCard from '../components/history/HistoryCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { getAllHistory, getHistoryByFilters, type HistoryRecord } from '../services/history.service';
import { getAllUsers, type UserData } from '../services/user.service';

type HistoryEntry = {
    id: string;
    timestamp: string;
    username: string;
    action: string;
    details?: string;
};

type HistoryFilters = {
    username?: string;
    startDate?: string;
    endDate?: string;
};

const History = () => {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [, setSelectedEntry] = useState<HistoryEntry | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [filters, setFilters] = useState<HistoryFilters>({
        username: '',
        startDate: '',
        endDate: ''
    });

    const userInfo = {
        name: sessionStorage.getItem('name') || 'Usuario',
        department: sessionStorage.getItem('department') || 'Departamento'
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historyData, usersData] = await Promise.all([
                    getAllHistory(),
                    getAllUsers()
                ]);
                mapAndSetEntries(historyData);
                setUsers(usersData);
                setFilteredUsers(usersData);
            } catch (err: any) {
                setError(err.message || 'Error al cargar datos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const mapAndSetEntries = (historyData: HistoryRecord[]) => {
        const mappedEntries: HistoryEntry[] = historyData.map((record: HistoryRecord) => ({
            id: record._id || '',
            timestamp: new Date(record.timestamp).toLocaleString(),
            username: record.username,
            action: record.message,
            details: record.expirationDate
                ? `Expira: ${new Date(record.expirationDate).toLocaleString()}`
                : undefined
        }));
        setEntries(mappedEntries);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleUsernameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters(prev => ({ ...prev, username: value }));

        if (value.length > 0) {
            const filtered = users.filter(user =>
                user.username.toLowerCase().includes(value.toLowerCase()) ||
                user.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
            setShowDropdown(true);
        } else {
            setFilteredUsers(users);
            setShowDropdown(false);
        }
    };

    const selectUser = (user: UserData) => {
        setFilters(prev => ({ ...prev, username: user.username }));
        setShowDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearchLoading(true);

        // Validar fechas
        if (filters.startDate && filters.endDate && new Date(filters.endDate) < new Date(filters.startDate)) {
            setError("La fecha final no puede ser menor que la inicial");
            setSearchLoading(false);
            return;
        }

        try {
            // Limpiar filtros vacíos
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== "")
            ) as HistoryFilters;

            const historyData = await getHistoryByFilters(
                cleanFilters.username,
                cleanFilters.startDate,
                cleanFilters.endDate
            );

            mapAndSetEntries(historyData);
        } catch (err: any) {
            setError(err.message || 'Error al filtrar el historial');
            console.error(err);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleReset = async () => {
        setFilters({
            username: '',
            startDate: '',
            endDate: ''
        });
        setLoading(true);
        try {
            const historyData = await getAllHistory();
            mapAndSetEntries(historyData);
            setFilteredUsers(users);
        } catch (err: any) {
            setError(err.message || 'Error al cargar el historial');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (id: string) => {
        const entry = entries.find(e => e.id === id);
        if (entry) {
            setSelectedEntry(entry);
            console.log('Detalles completos:', entry);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}

            <div className="md:block md:w-64 flex-shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 min-w-0">
                <div className="h-16 md:h-0" />

                <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h1 className="text-3xl font-semibold text-gray-800">Historial</h1>
                        <div className="text-sm text-gray-600">
                            Mostrando historial de {userInfo.name} ({userInfo.department})
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Búsqueda de usuario con dropdown */}
                                <div className="relative">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Usuario
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            ref={searchInputRef}
                                            value={filters.username}
                                            onChange={handleUsernameSearch}
                                            onFocus={() => setShowDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Buscar por usuario o nombre"
                                            autoComplete="off"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>

                                    {showDropdown && filteredUsers.length > 0 && (
                                        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {filteredUsers.map((user) => (
                                                <li
                                                    key={user.username}
                                                    className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                                    onClick={() => selectUser(user)}
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

                                {/* Filtros de fecha */}
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                                <button
                                    type="submit"
                                    disabled={searchLoading}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                                >
                                    {searchLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Buscando...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="mr-2 h-4 w-4" />
                                            Buscar
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={searchLoading}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Limpiar
                                </button>
                            </div>
                        </form>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {windowWidth >= 1293 ? (
                                <HistoryList
                                    entries={entries}
                                    onViewDetails={handleViewDetails}
                                />
                            ) : (
                                <HistoryCard
                                    entries={entries}
                                    onViewDetails={handleViewDetails}
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default History;