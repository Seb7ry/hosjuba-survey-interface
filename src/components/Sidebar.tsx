import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Home,
  FileText,
  User,
  ClipboardList,
  BookOpen,
  BarChart2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { label: "Inicio", icon: <Home size={20} />, path: "/dashboard" },
    { label: "Usuarios", icon: <User size={20} />, path: "/user" },
    { label: "Plantillas", icon: <FileText size={20} />, path: "/template" },
    { label: "Casos", icon: <ClipboardList size={20} />, path: "/cases" },
    { label: "Reportes", icon: <BarChart2 size={20} />, path: "/reports" },
    { label: "Historial", icon: <BookOpen size={20} />, path: "/history" },
  ];

  return (
    <>
      {!open && (
        <div className="fixed top-4 left-4 z-40 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="p-2 bg-white text-gray-800 rounded-md shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Abrir menú"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>
      )}

      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0 shadow-xl" : "-translate-x-full"}
        md:translate-x-0 md:shadow-none`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-200 relative">
            <div className="pr-8">
              <h2 className="text-lg font-semibold text-gray-900 break-words line-clamp-2">
                {sessionStorage.getItem("name") || "Usuario"}
              </h2>
              <p className="text-sm text-gray-600 italic truncate max-w-[90%]">
                {sessionStorage.getItem("department") || "Departamento"}
              </p>
              <p className="text-xs text-gray-500 break-words">
                {sessionStorage.getItem("position") || "Cargo"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-4 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200 md:hidden"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-2 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                      location.pathname === item.path
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <span
                      className={`transition-colors duration-200 ${
                        location.pathname === item.path
                          ? "text-blue-700"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
            >
              <LogOut size={18} className="text-red-600" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
