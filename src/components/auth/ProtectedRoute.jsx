import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Guards routes that require a logged-in customer account.
// Redirects to /login and remembers where the user was headed.
const ProtectedRoute = () => {
  const { isAuthenticated, account } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || account?.role !== "user") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
