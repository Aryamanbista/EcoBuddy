// src/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/dashboard" />;
  }

  return children;
};