import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Guards /admin/* routes. Only an authenticated admin account may pass.
const AdminProtectedRoute = () => {
  const { isAuthenticated, account } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || account?.role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
