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
    { label: "Usuarios", icon: <FileText size={18} />, path: "/dashboard" },
    { label: "Plantillas", icon: <FileText size={18} />, path: "/dashboard" },
    { label: "Casos", icon: <FileText size={18} />, path: "/dashboard" },
    { label: "Reportes", icon: <FileText size={18} />, path: "/dashboard" },
    { label: "Historial", icon: <FileText size={18} />, path: "/dashboard" },
    // Puedes agregar más items aquí
  ];

  return (
    <>
      {/* Botón hamburguesa visible solo en móvil */}
      <div className="md:hidden fixed top-4 left-4 z-50 p-3 bg-blue-500 text-white rounded-full shadow-md flex items-center justify-center">
        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        {/* Encabezado */}
        <div className="flex flex-col items-start justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-black">{sessionStorage.getItem("name")}</h2>
          <p className="text-sm font-semibold text-black mt-1">{sessionStorage.getItem("department")}</p>
          <p className="text-sm font-semibold text-black mt-1">{sessionStorage.getItem("position")}</p>
          <button onClick={() => setOpen(false)} className="md:hidden mt-1">
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
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
          >
            <LogOut size={18} />
            Salir
          </button>
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
