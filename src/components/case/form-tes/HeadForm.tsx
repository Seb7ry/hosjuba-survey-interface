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
  validateForm: externalValidateForm,
  setValidateForm: externalSetValidateForm
}: HeadFormProps) => {
  const [internalValidateForm, setInternalValidateForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = externalValidateForm ?? internalValidateForm;
  const setValidateForm = externalSetValidateForm ?? setInternalValidateForm;

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
    </>
  );
};

export default HeadForm;