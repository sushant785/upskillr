import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const auth = JSON.parse(localStorage.getItem('auth'));

  // Not logged in
  if (!auth || !auth.token) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch
  if (!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
