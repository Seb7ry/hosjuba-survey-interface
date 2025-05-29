import BasicInfo from "./BasicInfo";
import CorrectiveInfo from "./CorrectiveInfo";
import PreventiveInfo from "./PreventiveInfo";
import ReporterInfo from "./ReporterInfo";
import TechnicianInfo from "./TechnicianInfo";

interface HeadFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isPreventive: boolean;
}

const HeadForm = ({ formData, handleChange, setFormData, isPreventive }: HeadFormProps) => {
  return (
    <>
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