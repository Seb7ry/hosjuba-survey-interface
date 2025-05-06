import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard"; 
import { useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import User from "./pages/User";
import Template from "./pages/Template";

function App() {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("access_token");

  useEffect(() => {
    if (accessToken && window.location.pathname === "/") {
      navigate("/dashboard"); 
    }
  }, [accessToken, navigate]); 

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<User />} />
        <Route path="/template" element={<Template />} />
      </Route>
    </Routes>
  );
}

export default App;
