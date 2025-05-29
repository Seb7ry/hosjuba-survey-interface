import CorrectiveBody from "./CorrectiveBody";
import PreventiveBody from "./PreventiveBody";


export type CustomChangeEvent = {
  target: {
    name: string;
    value: string | boolean;
    type?: string;
  };
};

interface BodyFormProps {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | CustomChangeEvent
  ) => void;
  isPreventive: boolean;
}

const BodyForm = ({ formData, handleChange, isPreventive }: BodyFormProps) => {
  if (!isPreventive) {
    return (
      <CorrectiveBody
        formData={formData}
        handleChange={handleChange}
      />
    );
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({
      target: {
        name: e.target.name,
        value: e.target.checked,
        type: e.target.type
      }
    });
  };

  const handleEnableToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({
      target: {
        name: e.target.name,
        value: e.target.checked,
        type: e.target.type
      }
    });
  };

  return (
    <PreventiveBody
      formData={formData}
      handleCheckboxChange={handleCheckboxChange}
      handleEnableToggle={handleEnableToggle}
    />
  );
};

export default BodyForm;