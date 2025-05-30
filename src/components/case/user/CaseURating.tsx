import { useEffect, useState, type ChangeEvent } from 'react';
import { X } from 'lucide-react';
import { SignatureField } from '../../signature/SignatureField';
import { FaStar, FaEye } from 'react-icons/fa';
import { getUserByUsername } from '../../../services/user.service';
import SignaturePadModal from '../../signature/SignatureModal';
import ConfirmDialog from '../../ConfirmDialog';
import CasePDF from '../CasePDF';
import { ErrorMessage } from '../../ErrorMessage';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (ratings: { satisfaction: number; effectiveness: number }, signature: string) => void;
    isSubmitting?: boolean;
    username: string;
    onSuccess?: () => void;
    caseNumber?: string;
    typeCase?: 'preventive' | 'corrective';
}

const CaseURating = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    username,
    onSuccess,
    caseNumber,
    typeCase
}: RatingModalProps) => {
    const [satisfaction, setSatisfaction] = useState(0);
    const [effectiveness, setEffectiveness] = useState(0);
    const [signature, setSignature] = useState('');
    const [hoveredSatisfaction, setHoveredSatisfaction] = useState(0);
    const [hoveredEffectiveness, setHoveredEffectiveness] = useState(0);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [, setShowSuccessDialog] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [, setIsLoadingPdf] = useState(false);
    const [, setPdfError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                const user = await getUserByUsername(username);
                setSignature(user.signature || '');
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setSignature('');
            }
        };

        fetchData();
    }, [isOpen, username]);

    const handleViewDocument = async () => {
        if (!caseNumber || !typeCase) return;

        try {
            setIsLoadingPdf(true);
            setPdfError(null);
            setShowPdfModal(true);
        } catch (error) {
            console.error('Error al cargar PDF:', error);
            setPdfError('Error al cargar el documento del servicio');
        } finally {
            setIsLoadingPdf(false);
        }
    };

    if (!isOpen) return null;

    const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            setValidationError('Por favor, sube solo imágenes');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const base64String = event.target.result as string;
                setSignature(base64String);
                setValidationError(null);
            }
        };
        reader.onerror = () => setValidationError('Error al cargar la imagen');
        reader.readAsDataURL(file);
    };

    const handleSaveSignature = (signature: string) => {
        setSignature(signature);
        setIsSignatureModalOpen(false);
        setValidationError(null);
    };

    const removeSignature = () => {
        setSignature('');
    };

    const validateForm = () => {
        setValidationError(null);

        if (typeCase === 'corrective') {
            if (satisfaction === 0 || effectiveness === 0) {
                setValidationError('Por favor califique ambos aspectos');
                return false;
            }
        } else {
            if (satisfaction === 0) {
                setValidationError('Por favor califique la satisfacción');
                return false;
            }
        }

        if (!signature) {
            setValidationError('Por favor agregue su firma para confirmar');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        setShowConfirmDialog(true);
    };

    const confirmSubmit = async () => {
        setShowConfirmDialog(false);

        try {
            await onSubmit({ satisfaction, effectiveness }, signature);
            setShowSuccessDialog(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error al enviar la calificación:', error);
            setValidationError('Ocurrió un error al enviar la calificación');
        }
    };

    const renderStars = (rating: number, hoveredRating: number, setRating: (val: number) => void, setHoveredRating: (val: number) => void) => {
        return (
            <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                    >
                        <FaStar
                            className={`h-6 w-6 ${(hoveredRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-semibold text-gray-800">Calificar Servicio</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {validationError && (
                            <ErrorMessage
                                message={validationError}
                                onClose={() => setValidationError(null)}
                            />
                        )}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-700">Documento del servicio</h3>
                                {caseNumber && typeCase && (
                                    <button
                                        onClick={handleViewDocument}
                                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        <FaEye className="w-4 h-4" />
                                        <span>Visualizar documento</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={`grid ${typeCase === 'corrective' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-700 text-center">Satisfacción con el servicio</h3>
                                {renderStars(
                                    satisfaction,
                                    hoveredSatisfaction,
                                    setSatisfaction,
                                    setHoveredSatisfaction
                                )}
                                <div className="flex justify-between text-xs text-gray-500 px-2">
                                    <span>Malo</span>
                                    <span>Regular</span>
                                    <span>Bueno</span>
                                    <span>Excelente</span>
                                </div>
                            </div>

                            {typeCase === 'corrective' && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-700 text-center">Efectividad del servicio</h3>
                                    {renderStars(
                                        effectiveness,
                                        hoveredEffectiveness,
                                        setEffectiveness,
                                        setHoveredEffectiveness
                                    )}
                                    <div className="flex justify-between text-xs text-gray-500 px-2">
                                        <span>Malo</span>
                                        <span>Regular</span>
                                        <span>Bueno</span>
                                        <span>Excelente</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Firma de confirmación</h3>
                            <p className="text-xs text-gray-500">Por favor dibuje o suba su firma para confirmar la calificación</p>
                            <SignatureField
                                signature={signature}
                                onUpload={handleSignatureUpload}
                                onDraw={() => setIsSignatureModalOpen(true)}
                                onChange={setSignature}
                                onRemove={removeSignature}
                                isRequired={true}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SignaturePadModal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                onSave={handleSaveSignature}
            />

            <ConfirmDialog
                isOpen={showConfirmDialog}
                message="¿Estás seguro que deseas enviar esta calificación?"
                onCancel={() => setShowConfirmDialog(false)}
                onConfirm={confirmSubmit}
                isProcessing={isSubmitting}
            />

            {caseNumber && typeCase && (
                <CasePDF
                    isOpen={showPdfModal}
                    onClose={() => setShowPdfModal(false)}
                    caseNumber={caseNumber}
                    typeCase={typeCase === 'preventive' ? 'Preventivo' : 'Mantenimiento'}
                />
            )}
        </>
    );
};

export default CaseURating;