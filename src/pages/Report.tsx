import { useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { ErrorMessage } from '../components/ErrorMessage';
import { generateReport, type TimeInterval as ApiTimeInterval, type ReportType } from '../services/report.service';
import SuccessDialog from '../components/SuccessDialog';

const intervalMap: Record<TimeInterval, ApiTimeInterval> = {
    monthly: 'mensual',
    quarterly: 'trimestral',
    semester: 'semestral',
    yearly: 'anual',
    custom: 'personalizado'
};

type TimeInterval = 'monthly' | 'quarterly' | 'semester' | 'yearly' | 'custom';

const Report = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [reportType, setReportType] = useState<ReportType>('Mantenimiento');
    const [interval, setInterval] = useState<TimeInterval>('monthly');
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        let intervalId: number | undefined;
        if (loading) {
            setProgress(0);
            intervalId = window.setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + 10;
                });
            }, 300);
        } else {
            setProgress(100);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [loading]);

    const handleGenerateReport = async () => {
        setLoading(true);
        setError('');
        try {
            if (interval === 'custom' && (!startDate || !endDate)) {
                throw new Error('Para intervalo personalizado, debe especificar fechas de inicio y fin');
            }

            const startDateObj = startDate ? new Date(startDate) : undefined;
            const endDateObj = endDate ? new Date(endDate) : undefined;

            const apiInterval = intervalMap[interval];

            await generateReport({
                type: reportType,
                interval: apiInterval,
                year: ['yearly', 'semester', 'quarterly', 'monthly'].includes(interval) ? parseInt(year) : undefined,
                month: ['semester', 'quarterly', 'monthly'].includes(interval) ? parseInt(month) : undefined,
                startDate: interval === 'custom' ? startDateObj : undefined,
                endDate: interval === 'custom' ? endDateObj : undefined
            });

            setDialogOpen(true);
        } catch (err: any) {
            setError(err.message || 'Error al generar el reporte');
        } finally {
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
            case 'semester':
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={month} // Reutilizamos month para el semestre
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <option value="1">Primer semestre (Ene-Jun)</option>
                                <option value="2">Segundo semestre (Jul-Dic)</option>
                            </select>
                        </div>
                    </>
                );
            case 'quarterly':
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trimestre</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <option value="1">Primer trimestre (Ene-Mar)</option>
                                <option value="2">Segundo trimestre (Abr-Jun)</option>
                                <option value="3">Tercer trimestre (Jul-Sep)</option>
                                <option value="4">Cuarto trimestre (Oct-Dic)</option>
                            </select>
                        </div>
                    </>
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
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                                    const monthName = new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' });
                                    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                                    return (
                                        <option key={m} value={m}>
                                            {capitalizedMonth}
                                        </option>
                                    );
                                })}
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
                                max={endDate || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                                max={new Date().toISOString().split('T')[0]}
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
            <SuccessDialog
                isOpen={dialogOpen}
                message="Reporte generado exitosamente"
                label="Tipo de reporte"
                caseNumber={reportType}
                onClose={() => setDialogOpen(false)}
            />

            <div className="md:block md:w-64 flex-shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 min-w-0">
                <div className="h-16 md:h-0" />
                <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Generación de Reportes</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden p-4 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value as ReportType)}
                                    >
                                        <option value="Mantenimiento">Mantenimientos Correctivos</option>
                                        <option value="Preventivo">Mantenimientos Preventivos</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                                        value={interval}
                                        onChange={(e) => setInterval(e.target.value as TimeInterval)}
                                    >
                                        <option value="monthly">Mensual</option>
                                        <option value="quarterly">Trimestral</option>
                                        <option value="semester">Semestral</option>
                                        <option value="yearly">Anual</option>
                                        <option value="custom">Personalizado</option>
                                    </select>
                                </div>

                                {renderDateInputs()}
                            </div>

                            {/* Panel de descarga con botón grande */}
                            <div className="flex flex-col justify-center items-center">
                                <button
                                    onClick={handleGenerateReport}
                                    disabled={loading}
                                    title="Generar Reporte"
                                    className={`bg-gray-100 hover:bg-gray-200 transition-colors rounded-full w-24 h-24 flex items-center justify-center shadow 
                    ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    {loading ? (
                                        <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
                                    ) : (
                                        <Download className="h-10 w-10 text-blue-600" />
                                    )}
                                </button>
                                <p className="text-center mt-3 text-gray-600 text-sm">
                                    {loading ? 'Generando...' : 'Descargar Reporte'}
                                </p>

                                {/* Barra de progreso */}
                                {loading && (
                                    <div className="w-48 h-2 bg-gray-200 rounded-full mt-4">
                                        <div
                                            className="h-2 bg-blue-500 rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Report;
