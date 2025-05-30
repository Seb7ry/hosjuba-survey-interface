import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FaWpforms, FaFileAlt, FaTrashAlt } from "react-icons/fa";

const Case = () => {
    const navigate = useNavigate();

    const formCards = [
        {
            id: 1,
            title: "Formulario de Mantenimiento Preventivo",
            description: "Registra información detallada sobre casos de atención preventiva, seguimiento y control de riesgos.",
            icon: <FaWpforms />,
            path: "preventive",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            borderColor: "border-blue-200"
        },
        {
            id: 2,
            title: "Formulario de Mantenimiento Correctivo",
            description: "Documenta las actividades realizadas durante el mantenimiento preventivo o correctivo de equipos médicos y tecnológicos.",
            icon: <FaFileAlt />,
            path: "corrective",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-600",
            borderColor: "border-yellow-200"
        },
        {
            id: 3,
            title: "Casos Eliminados",
            description: "Papelera de casos eliminados, podrás recuperarlos en menos de 30 días de su eliminación.",
            icon: <FaTrashAlt />,
            path: "deleted",
            bgColor: "bg-gray-50",
            textColor: "text-gray-600",
            borderColor: "border-gray-200"
        }
    ];

    const handleCardClick = (formPath: string) => {
        navigate(`/${formPath}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            <div className="md:block md:w-64 flex-shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1">
                <div className="h-16 md:h-0"></div>

                <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-10 tracking-tight">
                        Selecciona un formulario
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {formCards.map((card) => (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(card.path)}
                                className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-6 cursor-pointer transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]`}
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`${card.textColor} text-3xl`}>
                                        {card.icon}
                                    </div>
                                    <h2 className={`${card.textColor} text-xl font-semibold`}>
                                        {card.title}
                                    </h2>
                                </div>
                                <p className="text-gray-600 mb-4">{card.description}</p>
                                <span
                                    className={`${card.textColor} text-sm font-medium hover:underline`}
                                >
                                    Seleccionar →
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Case;
