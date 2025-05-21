import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import User from "./pages/User";
import Case from "./pages/Case";
import SessionMonitor from "./components/session/SessionMonitor";
import Modal from 'react-modal';
import Corrective from "./components/case/Corrective";
import Preventive from "./components/case/Preventive";
import CaseForm from "./components/case/CaseForm";
import Equipment from "./pages/Equipment";
import Report from "./pages/Report";

if (typeof window !== 'undefined' && document.getElementById('root')) {
  Modal.setAppElement('#root');
} else if (typeof window !== 'undefined') {
  Modal.setAppElement(document.body);
}

function App() {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("access_token");

  useEffect(() => {
    if (accessToken && window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [accessToken, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/case" element={<Case />} />

          <Route path="/corrective" element={<Corrective />} />
          <Route path="/corrective/new" element={<CaseForm isPreventive={false} />} />
          <Route path="/corrective/edit/:numberCase" element={<CaseForm isPreventive={false} />} />

          <Route path="/preventive" element={<Preventive />} />
          <Route path="/preventive/new" element={<CaseForm isPreventive={true} />} />
          <Route path="/preventive/edit/:numberCase" element={<CaseForm isPreventive={true} />} />

          <Route path="/report" element={<Report />} />
        </Route>
      </Routes>

      {/* Renderiza SessionMonitor solo cuando hay token y no estamos en la página de login */}
      {accessToken && window.location.pathname !== "/" && <SessionMonitor />}
    </>
  );
}

export default App;