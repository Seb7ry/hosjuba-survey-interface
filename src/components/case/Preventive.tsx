import Sidebar from "../Sidebar";
import CaseList from "./CaseList";

const Preventive = () => {
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
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
                        Casos Preventivos
                    </h1>
                    <CaseList typeCase="Preventivo" />
                </div>
            </main>
        </div>
    );
};

export default Preventive;