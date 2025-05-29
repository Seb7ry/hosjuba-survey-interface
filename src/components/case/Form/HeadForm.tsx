import { useState } from "react";
import BasicInfo from "./BasicInfo";
import CorrectiveInfo from "./CorrectiveInfo";
import PreventiveInfo from "./PreventiveInfo";
import ReporterInfo from "./ReporterInfo";
import TechnicianInfo from "./TechnicianInfo";
import { ErrorMessage } from "../../ErrorMessage";

interface HeadFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isPreventive: boolean;
  onSave: () => void;
  validateForm?: boolean;
  setValidateForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeadForm = ({
  formData,
  handleChange,
  setFormData,
  isPreventive,
  onSave,
  validateForm: externalValidateForm,
  setValidateForm: externalSetValidateForm
}: HeadFormProps) => {
  const [internalValidateForm, setInternalValidateForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = externalValidateForm ?? internalValidateForm;
  const setValidateForm = externalSetValidateForm ?? setInternalValidateForm;

  const handleSubmit = () => {
    setValidateForm(true);

    if (!formData.assignedTechnician?.signature) {
      setFormError("Debe registrar la firma del técnico antes de guardar");
      return;
    }

    setFormError(null);
    onSave();
  };

  return (
    <>
      {formError && (
        <ErrorMessage
          message={formError}
          onClose={() => setFormError(null)}
        />
      )}

      <BasicInfo
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        isPreventive={isPreventive}
      />

      <ReporterInfo
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
      />

      <TechnicianInfo
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        isPreventive={isPreventive}
        validateForm={validateForm}
        setValidateForm={setValidateForm}
      />

      {isPreventive && (
        <PreventiveInfo
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
      )}

      {!isPreventive && (
        <CorrectiveInfo
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Guardar
        </button>
      </div>
    </>
  );
};

export default HeadForm;