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
  const [, setCreatedCaseNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validateForm, setValidateForm] = useState(false);
  const [, setFormError] = useState<string | null>(null);

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

  const validateFormBeforeSubmit = () => {
    setValidateForm(true);

    if (!formData.assignedTechnician?.signature) {
      setFormError("Debe registrar la firma del técnico antes de guardar");
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | CustomChangeEvent
  ) => {
    const target = 'nativeEvent' in e ? e.target : e.target;
    const name = target.name;
    const value = target.value;
    const type = 'type' in target ? target.type : 'text';

    // 👇 Safe checkbox check
    const finalValue =
      type === 'checkbox' && 'checked' in target
        ? (target as HTMLInputElement).checked
        : value;

    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData((prev: any) => {
        const newState = { ...prev };
        let current = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
          } else {
            current[key] = { ...current[key] };
          }
          current = current[key];
        }

        current[keys[keys.length - 1]] = finalValue;
        return newState;
      });
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: finalValue,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFormBeforeSubmit()) {
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSubmitCase = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      let updatedOrCreatedCase;
      let shouldCreateEscalation = false;

      if (isEditMode && numberCase) {

        const originalCase = await getCaseByNumber(numberCase);
        updatedOrCreatedCase = await updateCase(numberCase, formData);

        if (!isPreventive) {
          const currentServiceData = formData.serviceData as any;
          const originalServiceData = originalCase.serviceData as any;

          shouldCreateEscalation =
            currentServiceData.requiresEscalation &&
            currentServiceData.escalationTechnician?._id &&
            (!originalServiceData.requiresEscalation ||
              originalServiceData.escalationTechnician?._id !== currentServiceData.escalationTechnician._id);
        }
      } else {
        updatedOrCreatedCase = await createCase(formData);

        if (!isPreventive) {
          const currentServiceData = formData.serviceData as any;
          shouldCreateEscalation =
            currentServiceData.requiresEscalation &&
            currentServiceData.escalationTechnician?._id;
        }
      }

      if (shouldCreateEscalation) {
        const currentServiceData = formData.serviceData as any;

        const updatedOriginalCase = {
          ...formData,
          status: "Cerrado",
          serviceData: {
            ...currentServiceData,
            solvedAt: new Date().toISOString()
          }
        };

        if (isEditMode && numberCase) {
          await updateCase(numberCase, updatedOriginalCase);
        } else {
          const newCase = JSON.parse(JSON.stringify(updatedOriginalCase))
          delete newCase.caseNumber;
          await updateCase(updatedOrCreatedCase.caseNumber, newCase);
        }

        const escalationCaseData = JSON.parse(JSON.stringify(formData));
        delete escalationCaseData._id;

        const escalationCase = {
          ...escalationCaseData,
          status: "Abierto",
          assignedTechnician: {
            _id: currentServiceData.escalationTechnician._id,
            name: currentServiceData.escalationTechnician.name,
            position: currentServiceData.escalationTechnician.position,
            department: currentServiceData.escalationTechnician.department,
            signature: currentServiceData.escalationTechnician.signature || ""
          },
          serviceData: {
            ...currentServiceData,
            level: currentServiceData.escalationTechnician.level,
            requiresEscalation: false,
            escalationTechnician: {
              _id: "",
              name: "",
              position: "",
              department: "",
              signature: "",
              level: ""
            },
            attendedAt: "",
            solvedAt: "",
            diagnosis: "",
            solution: ""
          }
        };

        const escalationCaseResult = await createCase(escalationCase);
        if (!escalationCaseResult || !escalationCaseResult._id) {
          console.error("❌ Fallo al crear el caso de escalamiento: Respuesta inválida");
          throw new Error("Error al crear el caso de escalamiento. La respuesta fue inválida.");
        }
      }

      setCreatedCaseNumber(updatedOrCreatedCase.caseNumber);
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("💥 Error al guardar el caso:", error);
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
              validateForm={validateForm}
              setValidateForm={setValidateForm} onSave={function (): void {
                throw new Error("Function not implemented.");
              } }            />
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
        message={
          isEditMode
            ? !isPreventive &&
              'requiresEscalation' in formData.serviceData &&
              formData.serviceData.requiresEscalation
              ? 'El caso fue actualizado y se creó el caso de escalamiento correctamente.'
              : 'El caso fue actualizado correctamente.'
            : !isPreventive &&
              'requiresEscalation' in formData.serviceData &&
              formData.serviceData.requiresEscalation
              ? 'El caso principal y el caso de escalamiento fueron creados correctamente.'
              : 'El caso fue creado correctamente.'
        }
        onClose={handleSuccessDialogClose}
      />
    </div>
  );
};

export default CaseForm;