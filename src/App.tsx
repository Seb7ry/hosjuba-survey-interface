import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard"; 
import { useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import User from "./pages/User";
import Case from "./pages/Case";
import SessionMonitor from "./components/session/SessionMonitor";
import Modal from 'react-modal';

// Configuración inicial del modal para react-modal
if (typeof window !== 'undefined' && document.getElementById('root')) {
  Modal.setAppElement('#root');
} else if (typeof window !== 'undefined') {
  Modal.setAppElement(document.body);
}

function App() {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("access_token");

  useEffect(() => {
    // Redirige al dashboard si ya está autenticado y en la raíz
    if (accessToken && window.location.pathname === "/") {
      navigate("/dashboard"); 
    }
  }, [accessToken, navigate]); 

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/user" element={<User/>} />
          <Route path="/case" element={<Case/>} />
        </Route>
      </Routes>
      
      {/* Renderiza SessionMonitor solo cuando hay token y no estamos en la página de login */}
      {accessToken && window.location.pathname !== "/" && <SessionMonitor />}
    </>
  );
}

export default App;