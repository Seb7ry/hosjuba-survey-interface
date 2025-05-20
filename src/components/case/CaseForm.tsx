import { useEffect, useState } from "react";
import { createCase, getCaseByNumber, updateCase } from "../../services/case.service";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useFormPreventive, useFormCorrective } from "../Data";
import type { CustomChangeEvent } from "./form/BodyForm";
import HeadForm from "./form/HeadForm";
import BodyForm from "./form/BodyForm";
import ConfirmDialog from "../ConfirmDialog";
import SuccessDialog from "../SuccessDialog";

interface FormContainerProps {
  isPreventive: boolean;
}

const CaseForm = ({ isPreventive }: FormContainerProps) => {
  const navigate = useNavigate();
  const preventiveData = useFormPreventive();
  const correctiveData = useFormCorrective();
  const { formData, setFormData } = isPreventive ? preventiveData : correctiveData;

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdCaseNumber, setCreatedCaseNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { numberCase } = useParams();
  const isEditMode = !!numberCase && !numberCase.includes("new");

  useEffect(() => {
    const loadCase = async () => {
      if (isEditMode && numberCase) {
        try {
          const caseData = await getCaseByNumber(numberCase);
          setFormData(caseData);
        } catch (err) {
          console.error("Error al cargar el caso:", err);
          alert("No se pudo cargar el caso para editar.");
        }
      }
    };

    loadCase();
  }, [isEditMode, numberCase, setFormData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | CustomChangeEvent
  ) => {
    const target = 'nativeEvent' in e ? e.target : e.target;
    const name = target.name;
    const value = target.value;
    const type = 'type' in target ? target.type : 'text';
    const checked = type === 'checkbox' && 'checked' in target ? target.checked : undefined;

    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData((prev: any) => {
        const newState = { ...prev };
        let current = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]] = { ...current[keys[i]] };
        }
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
        return newState;
      });
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSubmitCase = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      let updatedOrCreatedCase;
      
      if (isEditMode && numberCase) {
        updatedOrCreatedCase = await updateCase(numberCase, formData);
      } else {
        updatedOrCreatedCase = await createCase(formData);
      }

      setCreatedCaseNumber(updatedOrCreatedCase.caseNumber);
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error al guardar el caso:", error);
      alert('Error al guardar el caso. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate(isPreventive ? '/preventive' : '/corrective');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <div className="md:block md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1">
        <div className="h-16 md:h-0"></div>

        <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
            {isEditMode
              ? isPreventive
                ? 'Editar Caso Preventivo'
                : 'Editar Caso de Mantenimiento'
              : isPreventive
                ? 'Nuevo Caso Preventivo'
                : 'Nuevo Caso de Mantenimiento'}
          </h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <HeadForm
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              isPreventive={isPreventive}
            />
            <BodyForm
              formData={formData}
              handleChange={handleChange}
              isPreventive={isPreventive}
            />

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(isPreventive ? '/preventive' : '/corrective')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  isEditMode
                    ? isPreventive
                      ? 'Guardar Cambios (Preventivo)'
                      : 'Guardar Cambios (Correctivo)'
                    : isPreventive
                      ? 'Crear Caso Preventivo'
                      : 'Crear Caso de Mantenimiento'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        message={isEditMode
          ? "¿Estás seguro que deseas guardar los cambios en este caso?"
          : "¿Estás seguro que deseas crear este caso?"}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={confirmSubmitCase}
        isProcessing={isSubmitting}
      />

      <SuccessDialog
        isOpen={showSuccessDialog}
        caseNumber={createdCaseNumber}
        onClose={handleSuccessDialogClose}
      />
    </div>
  );
};

export default CaseForm;