import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userData);

        if (adminOnly && user.role !== "admin") {
            return <Navigate to="/" replace />;
        }

        return children;
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;

