import Sidebar from "../components/Sidebar";

const Dashboard = () => {
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
          <div className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              Bienvenido al Dashboard
            </h2>
            {/* Aquí puedes agregar más contenido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800">Módulo 1</h3>
                <p className="text-sm text-gray-600 mt-2">Contenido del módulo</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">Módulo 2</h3>
                <p className="text-sm text-gray-600 mt-2">Contenido del módulo</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;