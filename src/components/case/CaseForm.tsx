// PreventiveForm.tsx o CorrectiveForm.tsx
import { createCase } from "../../services/case.service";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useFormPreventive, useFormCorrective } from "../Data";
import HeadForm from "./Form/HeadForm";
import BodyForm from "./Form/BodyForm";

interface FormContainerProps {
  isPreventive: boolean;
}

const CaseForm = ({ isPreventive }: FormContainerProps) => {
  const navigate = useNavigate();
  const preventiveData = useFormPreventive();
  const correctiveData = useFormCorrective();
  
  const { formData, setFormData } = isPreventive ? preventiveData : correctiveData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      setFormData((prev: any) => {
        if (parent in prev && typeof prev[parent as keyof typeof prev] === 'object') {
          return {
            ...prev,
            [parent]: {
              ...(prev[parent as keyof typeof prev] as object),
              [child]: type === 'checkbox' ? checked : value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCase(formData);
      navigate(isPreventive ? '/preventive' : '/corrective');
    } catch (error) {
      console.error("Error creating case:", error);
    }
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
            {isPreventive ? 'Nuevo Caso Preventivo' : 'Nuevo Caso de Mantenimiento'}
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
              >
                {isPreventive ? 'Crear Caso Preventivo' : 'Crear Caso de Mantenimiento'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CaseForm;