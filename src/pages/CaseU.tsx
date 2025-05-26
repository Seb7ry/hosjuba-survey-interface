import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { ErrorMessage } from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import CaseUList from '../components/case/user/CaseUList';
import { searchCases } from '../services/case.service';

export type Case = {
    reportedBy: any;
    toRating: any;
    rated: any;
    id: string;
    numero: string;
    tipoServicio: string;
    dependencia: string;
    estado: string;
    fechaReporte: string;
    tecnico: string;
};

const ITEMS_PER_PAGE = 10;

const CaseU = () => {
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [userInfo, setUserInfo] = useState({
        id: '',
        name: '',
        department: ''
    });
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const user = {
            id: sessionStorage.getItem('username') || '',
            name: sessionStorage.getItem('name') || '',
            department: sessionStorage.getItem('department') || ''
        };
        setUserInfo(user);
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadCases = async () => {
            try {
                setLoading(true);

                const fetchedCases = await searchCases({
                    reportedByName: userInfo.name
                });

                const filteredCases = fetchedCases
                    .filter((caseItem: any) =>
                    (caseItem.caseNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        caseItem.dependency.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
                    )
                    .filter((caseItem: any) =>
                        !caseItem.caseNumber.trim().toUpperCase().endsWith('R')
                    );

                const mappedCases: Case[] = filteredCases.map((item: any) => ({
                    id: item._id,
                    numero: item.caseNumber,
                    tipoServicio: item.typeCase,
                    dependencia: item.dependency,
                    estado: item.status,
                    fechaReporte: item.reportedAt,
                    tecnico: item.assignedTechnician?.name || 'Sin técnico',
                    reportedBy: item.reportedBy,
                    toRating: item.toRating,
                    rated: item.rated,
                }));

                setCases(mappedCases);
                setTotalPages(Math.ceil(mappedCases.length / ITEMS_PER_PAGE));
                setCurrentPage(1);
            } catch (err) {
                console.error("Error al cargar casos:", err);
                setError("No se pudieron cargar los casos. Intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        if (userInfo.id) {
            loadCases();
        }
    }, [debouncedSearchTerm, userInfo.id]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRateClick = (caseId: string) => {
        navigate(`/rate-case/${caseId}`);
    };

    const handleCaseUpdate = (updatedCase: Case) => {
        setCases(prevCases =>
            prevCases.map(c => c.id === updatedCase.id ? updatedCase : c)
        );
    };

    if (loading && cases.length === 0) {
        return (
            <div className="flex min-h-screen bg-gray-50 relative">
                <div className="md:block md:w-64 flex-shrink-0">
                    <Sidebar />
                </div>
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </main>
            </div>
        );
    }

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
                        <h1 className="text-3xl font-semibold text-gray-800">Mis Casos</h1>
                        <div className="text-sm text-gray-600">
                            Mostrando casos de {userInfo.name} ({userInfo.department})
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar casos por número o dependencia..."
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {loading && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500" />
                            </div>
                        )}
                    </div>

                    <CaseUList
                        cases={cases}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                        onPageChange={handlePageChange}
                        onRateClick={handleRateClick}
                        windowWidth={windowWidth}
                        onCaseUpdate={handleCaseUpdate}
                    />
                </div>
            </main>
        </div>
    );
};

export default CaseU;