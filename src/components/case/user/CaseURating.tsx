import { useEffect, useState, type ChangeEvent } from 'react';
import { X } from 'lucide-react';
import { SignatureField } from '../../signature/SignatureField';
import { FaStar } from 'react-icons/fa';
import { getUserByUsername } from '../../../services/user.service';
import SignaturePadModal from '../../signature/SignatureModal'; // Asegúrate de que la ruta sea correcta

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (ratings: { satisfaction: number; effectiveness: number }, signature: string) => void;
    isSubmitting?: boolean;
    username: string;
}

const CaseURating = ({ isOpen, onClose, onSubmit, isSubmitting = false, username }: RatingModalProps) => {
    const [satisfaction, setSatisfaction] = useState(0);
    const [effectiveness, setEffectiveness] = useState(0);
    const [signature, setSignature] = useState('');
    const [hoveredSatisfaction, setHoveredSatisfaction] = useState(0);
    const [hoveredEffectiveness, setHoveredEffectiveness] = useState(0);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchSignature = async () => {
            try {
                const user = await getUserByUsername(username);
                if (user.signature) {
                    setSignature(user.signature);
                } else {
                    setSignature('');
                }
            } catch (error) {
                console.error('Error al cargar firma del usuario:', error);
                setSignature('');
            }
        };

        fetchSignature();
    }, [isOpen, username]);

    if (!isOpen) return null;

    const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const base64String = event.target.result as string;
                setSignature(base64String);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveSignature = (signature: string) => {
        setSignature(signature);
        setIsSignatureModalOpen(false);
    };

    const removeSignature = () => {
        setSignature('');
    };

    const handleSubmit = () => {
        if (satisfaction === 0 || effectiveness === 0) {
            alert('Por favor califique ambos aspectos');
            return;
        }

        if (!signature) {
            alert('Por favor agregue su firma');
            return;
        }

        onSubmit({ satisfaction, effectiveness }, signature);
        onClose();
    };

    const renderStars = (rating: number, hoveredRating: number, setRating: (val: number) => void, setHoveredRating: (val: number) => void) => {
        return (
            <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
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
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700">Documento del servicio</h3>
                            </div>
                            <div className="h-64 bg-gray-100 flex items-center justify-center">
                                <p className="text-gray-500">Vista previa del PDF del servicio (estático)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-700 text-center">Satisfacción con el servicio</h3>
                                {renderStars(
                                    satisfaction,
                                    hoveredSatisfaction,
                                    setSatisfaction,
                                    setHoveredSatisfaction
                                )}
                                <div className="flex justify-between text-xs text-gray-500 px-2">
                                    <span>Muy insatisfecho</span>
                                    <span>Muy satisfecho</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-700 text-center">Efectividad del servicio</h3>
                                {renderStars(
                                    effectiveness,
                                    hoveredEffectiveness,
                                    setEffectiveness,
                                    setHoveredEffectiveness
                                )}
                                <div className="flex justify-between text-xs text-gray-500 px-2">
                                    <span>Nada efectivo</span>
                                    <span>Muy efectivo</span>
                                </div>
                            </div>
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
        </>
    );
};

export default CaseURating;