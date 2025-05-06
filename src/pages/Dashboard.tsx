// src/Dashboard.tsx
import Sidebar from "../components/Sidebar"; // Ajusta la ruta si es necesario

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4 text-black">
            Bienvenido al Dashboard
          </h2>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
