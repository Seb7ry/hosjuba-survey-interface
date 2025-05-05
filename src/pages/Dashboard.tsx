// src/Dashboard.tsx
import Sidebar from "../components/Sidebar"; // Ajusta la ruta si es necesario

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 min-h-screen bg-gray-100 p-6">
        <div className="max-w-md bg-white p-8 rounded-xl shadow-lg mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-4 text-black">
            Bienvenido al Dashboard
          </h2>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
