import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

export default RoleBasedRoute;
