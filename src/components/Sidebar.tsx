// src/components/Sidebar.tsx
import { useState } from "react";
import { Menu, X, LogOut, Home, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { label: "Inicio", icon: <Home size={18} />, path: "/dashboard" },
    { label: "Usuarios", icon: <FileText size={18} />, path: "/user" },
    { label: "Plantillas", icon: <FileText size={18} />, path: "/template" },
    { label: "Casos", icon: <FileText size={18} />, path: "/dashboard" },
    { label: "Reportes", icon: <FileText size={18} />, path: "/dashboard" },
    { label: "Historial", icon: <FileText size={18} />, path: "/dashboard" },
  ];

  return (
    <>
      {/* Botón hamburguesa fijo, visible solo en móvil */}
      <div className="fixed top-4 left-4 z-[60] md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="p-3 bg-blue-500 text-white rounded-full shadow-md flex items-center justify-center"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar fijo siempre visible en escritorio */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:block`}
      >
        <div className="flex flex-col justify-between h-full overflow-y-auto">
          {/* Encabezado */}
          <div className="relative p-4 border-b">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-black">{sessionStorage.getItem("name")}</h2>
              <p className="text-sm font-semibold text-black">{sessionStorage.getItem("department")}</p>
              <p className="text-sm font-semibold text-black">{sessionStorage.getItem("position")}</p>
            </div>
            {/* Botón cerrar solo en móvil */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black md:hidden"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col p-4 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 text-left text-sm"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Botón salir */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Fondo oscuro al abrir menú móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
