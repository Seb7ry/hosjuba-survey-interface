import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PrivateRoute;
