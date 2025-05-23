import { Navigate, Outlet } from "react-router-dom";

const DepartmentRoute = ({ allowedDepartments }: { allowedDepartments: string[] }) => {
    const token = sessionStorage.getItem("access_token");
    const department = sessionStorage.getItem("department");

    if (!token) return <Navigate to="/" />;

    if (!allowedDepartments.includes(department || "")) {
        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
};

export default DepartmentRoute;
