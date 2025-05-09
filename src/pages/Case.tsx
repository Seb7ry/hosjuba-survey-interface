import Sidebar from "../components/Sidebar";

const Case = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar lateral - ocupa espacio solo en desktop */}
            <div className=" md:block md:w-72">
                <Sidebar />
            </div>

            {/* Contenido principal con márgenes adaptables */}
            <main className="flex-1">
                {/* Espacio para el botón hamburguesa en móvil (h-16) */}
                <div className="h-16 md:h-0"></div>

                {/* Contenedor del contenido centrado */}
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-screen p-4">

                </div>
            </main>
        </div>
    );
};

export default Case;