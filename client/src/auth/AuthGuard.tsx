import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const AuthGuard = ({ allowedRoles }: any) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
