import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/welcome" replace /> : children;
};

export default PublicRoute;
