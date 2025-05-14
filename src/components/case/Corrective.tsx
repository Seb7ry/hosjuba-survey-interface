import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import CaseList from "./CaseList";
import Sidebar from "../Sidebar";

const Corrective = () => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            {/* Sidebar lateral - oculto en móvil por defecto */}
            <div className="md:block md:w-64 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Contenido principal - con margen izquierdo cuando el sidebar está visible */}
            <main className="flex-1">
                {/* Espacio para el header en móvil */}
                <div className="h-16 md:h-0"></div>

                <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Casos Correctivos
                        </h1>
                        <button
                            onClick={() => navigate("/corrective/new")}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Mantenimiento Correctivo
                        </button>
                    </div>
                    <CaseList typeCase="Mantenimiento" />
                </div>
            </main>
        </div>
    );
};

export default Corrective;