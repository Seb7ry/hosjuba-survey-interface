import { useEffect, useState } from 'react';
import { Download, Search, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { ErrorMessage } from '../components/ErrorMessage';

type TimeInterval = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
type ReportType = 'Mantenimiento' | 'Preventivo';

const Report = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reportType, setReportType] = useState<ReportType>('Mantenimiento');
    const [interval, setInterval] = useState<TimeInterval>('monthly');
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleGenerateReport = async () => {
        setLoading(true);
        setError('');

        try {
            // Validaciones básicas
            if (interval === 'custom' && (!startDate || !endDate)) {
                throw new Error('Para intervalo personalizado, debe especificar fechas de inicio y fin');
            }

            // Construir query params
            const params = new URLSearchParams();
            params.append('type', reportType);
            params.append('interval', interval);

            if (year) params.append('year', year);
            if (month) params.append('month', month);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            // Aquí implementarías la llamada al endpoint
            // const response = await fetch(`/api/reports/generate?${params.toString()}`);
            // const blob = await response.blob();
            // Crear enlace de descarga...

            // Simulación de éxito (remover en implementación real)
            console.log('Generando reporte con parámetros:', params.toString());
            setTimeout(() => {
                setLoading(false);
                alert('Reporte generado con éxito (simulación)');
            }, 1500);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const renderDateInputs = () => {
        switch (interval) {
            case 'yearly':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </div>
                );
            case 'monthly':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                            <input
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                min="2000"
                                max={new Date().getFullYear()}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>
                                        {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                );
            case 'custom':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </>
                );
            default:
                return null;
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
                        <h1 className="text-3xl font-semibold text-gray-800">Generación de Reportes</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value as ReportType)}
                                    >
                                        <option value="Mantenimiento">Mantenimiento</option>
                                        <option value="Preventivo">Preventivo</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={interval}
                                        onChange={(e) => setInterval(e.target.value as TimeInterval)}
                                    >
                                        <option value="daily">Diario</option>
                                        <option value="weekly">Semanal</option>
                                        <option value="monthly">Mensual</option>
                                        <option value="yearly">Anual</option>
                                        <option value="custom">Personalizado</option>
                                    </select>
                                </div>

                                {renderDateInputs()}
                            </div>

                            <div className="flex flex-col justify-between">
                                <div className="bg-gray-50 p-4 rounded-md h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Download className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">Configura los parámetros y genera tu reporte</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        Generar Reporte
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Report;