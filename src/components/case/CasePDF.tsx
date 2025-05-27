import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaTimes, FaDownload, FaPrint, FaExpand } from "react-icons/fa";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configuración del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface CasePDFProps {
    pdfUrl: string;
    onClose: () => void;
    caseNumber: string;
}

const CasePDF = ({ pdfUrl, onClose, caseNumber }: CasePDFProps) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    useEffect(() => {
        if (isMobile) {
            // Si es móvil, abrir en nueva pestaña y cerrar el modal
            window.open(pdfUrl, "_blank");
            onClose();
        }
    }, [isMobile, pdfUrl, onClose]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (numPages && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const zoomIn = () => {
        setScale(scale + 0.1);
    };

    const zoomOut = () => {
        if (scale > 0.5) {
            setScale(scale - 0.1);
        }
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable fullscreen: ${e.message}`);
            });
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `Caso-${caseNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        const printWindow = window.open(pdfUrl, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    if (isMobile) {
        return null; // No renderizar nada en móvil ya que se abre en nueva pestaña
    }

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                    <h3 className="text-lg font-semibold">Caso: {caseNumber}</h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            title="Descargar"
                        >
                            <FaDownload className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handlePrint}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            title="Imprimir"
                        >
                            <FaPrint className="w-5 h-5" />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                        >
                            <FaExpand className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                            title="Cerrar"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-auto p-4">
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="text-center py-8">Cargando PDF...</div>}
                        error={<div className="text-center py-8 text-red-500">Error al cargar el PDF</div>}
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={<div className="text-center py-8">Cargando página...</div>}
                        />
                    </Document>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={zoomOut}
                            disabled={scale <= 0.5}
                            className={`px-3 py-1 border rounded ${scale <= 0.5 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        >
                            -
                        </button>
                        <span className="text-sm">{(scale * 100).toFixed(0)}%</span>
                        <button
                            onClick={zoomIn}
                            className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                            className={`px-3 py-1 border rounded ${pageNumber <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        >
                            Anterior
                        </button>
                        <span className="text-sm">
                            Página {pageNumber} de {numPages || "?"}
                        </span>
                        <button
                            onClick={goToNextPage}
                            disabled={!!(numPages && pageNumber >= numPages)}
                            className={`px-3 py-1 border rounded ${numPages && pageNumber >= numPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CasePDF;