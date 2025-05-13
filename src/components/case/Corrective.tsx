import Sidebar from "../Sidebar";
import CaseList from "./CaseList";

const Corrective = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar lateral - oculto en móvil por defecto (se puede activar con un botón) */}
            <div className="md:block md:w-64 lg:w-72 bg-white shadow-sm">
                <Sidebar />
            </div>

            {/* Contenido principal */}
            <main className="flex-1">
                <div className="h-16 md:h-0"></div>
                <div className="p-4 md:p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-10 tracking-tight">
                        Casos Correctivos
                    </h1>
                    <CaseList />
                </div>
            </main>
        </div>
    );
};

export default Corrective;