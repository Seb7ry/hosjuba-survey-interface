import CorrectiveBody from "./CorrectiveBody";
import PreventiveBody from "./PreventiveBody";

type CustomChangeEvent = {
  target: {
    name: string;
    value: string;
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
    handleChange(e);
  };

  return (
    <PreventiveBody
      formData={formData}
      handleCheckboxChange={handleCheckboxChange}
    />
  );
};

export default BodyForm;