import Sidebar from "../components/Sidebar";
import { FaUsers, FaDesktop, FaClipboardList, FaChartBar, FaUserCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const department = typeof window !== 'undefined' ? sessionStorage.getItem('department') : null;
  const isSystems = department === 'Sistemas';
  const navigate = useNavigate();

  const systemCards = [
    {
      id: 1,
      title: "Usuarios",
      description: "Permite agregar, editar o eliminar usuarios asignando sus datos para iniciar sesión o asignarle las firmas.",
      icon: <FaUsers className="text-2xl" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      path: "/user"
    },
    {
      id: 2,
      title: "Equipos",
      description: "Permite agregar, editar o eliminar los equipos de la institución a los cuales se les asignarán los casos.",
      icon: <FaDesktop className="text-2xl" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      path: "/equipment"
    },
    {
      id: 3,
      title: "Casos",
      description: "Gestión de casos preventivos y correctivos, cada uno con su formulario específico. Incluye sección de casos eliminados.",
      icon: <FaClipboardList className="text-2xl" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      path: "/case"
    },
    {
      id: 4,
      title: "Reportes",
      description: "Generación de reportes por año, semestre, trimestre o mes de los diferentes casos en el sistema.",
      icon: <FaChartBar className="text-2xl" />,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
      path: "/report"
    },
    {
      id: 5,
      title: "Mis Casos",
      description: "Aquí podrás ver los casos asignados a ti, donde podrás calificarlos y firmarlos para la generación del documento final.",
      icon: <FaUserCheck className="text-2xl" />,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      path: "/user/case"
    }
  ];

  const nonSystemCard = {
    id: 1,
    title: "Mis Casos",
    description: "Aquí podrás ver los casos asignados a ti, donde podrás calificarlos y firmarlos para la generación del documento final.",
    icon: <FaUserCheck className="text-2xl" />,
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    path: "/user/case"
  };

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="md:block md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1">
        <div className="h-16 md:h-0"></div>

        <div className="p-4 sm:p-6 md:ml-6 md:mr-6 lg:ml-8 lg:mr-8">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2 tracking-tight">
              Sistema de Gestión de Mantenimientos
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Este software permite gestionar los casos de mantenimiento correctivo y preventivo del área de sistemas,
              facilitando la creación, asignación, seguimiento y documentación de cada caso mediante un proceso estandarizado.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
              Funcionalidades
            </h2>

            {isSystems ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {systemCards.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ y: -5 }}
                    onClick={() => handleCardClick(card.path)}
                    className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`${card.textColor}`}>
                        {card.icon}
                      </div>
                      <h3 className={`${card.textColor} text-xl font-semibold`}>
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <motion.div
                  whileHover={{ y: -5 }}
                  onClick={() => handleCardClick(nonSystemCard.path)}
                  className={`${nonSystemCard.bgColor} ${nonSystemCard.borderColor} border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`${nonSystemCard.textColor}`}>
                      {nonSystemCard.icon}
                    </div>
                    <h3 className={`${nonSystemCard.textColor} text-xl font-semibold`}>
                      {nonSystemCard.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">{nonSystemCard.description}</p>
                </motion.div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;