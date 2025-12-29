import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/*
  A route wrapper that only allows access if the user is authenticated.
  If not authenticated, redirects to the login page.
*/

export default function ProtectedRoute({ children }) {
  const { email, password } = useAuth();
  if (!email || !password) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

