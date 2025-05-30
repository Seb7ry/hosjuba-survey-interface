import { useEffect, useState } from "react";
import { generatePreventivePdf, generateCorrectivePdf } from "../../services/pdf.service";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

interface CasePDFProps {
    isOpen: boolean;
    onClose: () => void;
    caseNumber: string;
    typeCase: "Mantenimiento" | "Preventivo";
}

const CasePDF = ({ isOpen, onClose, caseNumber, typeCase }: CasePDFProps) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [mobilePdfGenerated, setMobilePdfGenerated] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }
            setMobilePdfGenerated(false);
            return;
        }

        const fetchPdf = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await (typeCase === "Preventivo"
                    ? generatePreventivePdf(caseNumber)
                    : generateCorrectivePdf(caseNumber));

                if (isMobile) {
                    // Para móviles, generamos el PDF pero no lo mostramos en el modal
                    const blob = new Blob([response], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    setPdfUrl(url);
                    setMobilePdfGenerated(true);
                    return;
                }

                // Para desktop, mostramos el PDF en el modal
                const blob = new Blob([response], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (err) {
                console.error("Error al generar PDF:", err);
                setError("No se pudo cargar el PDF. Por favor, intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchPdf();

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [isOpen, caseNumber, typeCase, isMobile]);

    const handleDownload = () => {
        if (!pdfUrl) return;

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `caso-${caseNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenInNewTab = () => {
        if (!pdfUrl) return;

        window.open(pdfUrl, '_blank');
        onClose();
    };

    return (
        <Transition appear show={isOpen} as="div">
            <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-black bg-opacity-50" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="w-full max-w-7xl h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center px-4 py-3 border-b bg-white z-10">
                            <h3 className="text-lg font-medium text-gray-900">
                                PDF del Caso {caseNumber}
                            </h3>
                            <div className="flex space-x-2">
                                {pdfUrl && !isMobile && (
                                    <button
                                        onClick={handleDownload}
                                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                                        title="Descargar PDF"
                                    >
                                        <FaDownload className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                    title="Cerrar"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow overflow-hidden p-4">
                            {loading && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
                                    <span className="ml-3">Generando PDF...</span>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                    <div className="flex">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <p className="ml-3 text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            )}

                            {isMobile && mobilePdfGenerated && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                    <FaExternalLinkAlt className="w-12 h-12 text-blue-500 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Estás en un dispositivo móvil
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Para una mejor experiencia, el PDF se abrirá en una nueva pestaña.
                                    </p>
                                    <button
                                        onClick={handleOpenInNewTab}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                                    >
                                        <span>Abrir PDF en nueva pestaña</span>
                                        <FaExternalLinkAlt className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {!isMobile && pdfUrl && (
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-full border-none"
                                    title={`PDF del caso ${caseNumber}`}
                                />
                            )}
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CasePDF;